package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.newdb.CompanyRdcMapper;
import com.smartcold.manage.cold.dao.newdb.CompanyUserMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.entity.newdb.CompanyRdc;
import com.smartcold.manage.cold.entity.newdb.CompanyUser;
import com.smartcold.manage.cold.entity.olddb.Rdc;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.service.RdcService;

@Service
public class RdcServiceImpl implements RdcService {

	@Autowired
	private RdcUserMapper rdcUserDao;

	@Autowired
	private RdcMapper rdcDao;

	@Autowired
	private CompanyUserMapper companyUserDao;

	@Autowired
	private CompanyRdcMapper companyRdcDao;

	@Override
	public List<Rdc> findRdcByUserid(int userid) {
		List<RdcUser> rdcUser = rdcUserDao.findsByUserId(userid);
		List<Rdc> rdcList = new ArrayList<>();
		if (rdcUser == null || rdcUser.size()==0) {
			return Lists.newArrayList();
		} else {
			for(RdcUser rdcUserItem:rdcUser){
				rdcList.add(rdcDao.selectByPrimaryKey(rdcUserItem.getRdcid()));
			}
			return rdcList;
		}
	}

	@Override
	public List<Rdc> findRdcsByUserId(int userid) {
		CompanyUser companyUser = companyUserDao.selectByUserId(userid);
		List<Rdc> result = Lists.newArrayList();
		if (companyUser != null) {
			List<CompanyRdc> companyRdcs = companyRdcDao.selectByCompId(companyUser.getCompanyid());
			if (!CollectionUtils.isEmpty(companyRdcs)) {
				for (CompanyRdc companyRdc : companyRdcs) {
					List<Rdc> rdcByRDCId1 = rdcDao.findRDCByRDCId(companyRdc.getRdcid());
					if (!CollectionUtils.isEmpty(rdcByRDCId1)) {
						result.add(rdcByRDCId1.get(0));
					}
				}
			}
		} else {
			result = findRdcByUserid(userid);
		}
		return result;
	}


}
