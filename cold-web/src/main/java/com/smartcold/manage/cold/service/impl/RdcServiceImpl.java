package com.smartcold.manage.cold.service.impl;

import java.util.List;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.newdb.CompanyRdcMapper;
import com.smartcold.manage.cold.dao.newdb.CompanyUserMapper;
import com.smartcold.manage.cold.entity.newdb.CompanyRdc;
import com.smartcold.manage.cold.entity.newdb.CompanyUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.entity.olddb.Rdc;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.service.RdcService;
import org.springframework.util.CollectionUtils;

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
		RdcUser rdcUser = rdcUserDao.findByUserId(userid);
		if (rdcUser == null) {
			return Lists.newArrayList();
		} else {
			return rdcDao.findRDCByRDCId(rdcUser.getRdcid());
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
