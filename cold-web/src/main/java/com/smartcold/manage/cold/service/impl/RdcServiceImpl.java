package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.RdcMapper;
import com.smartcold.manage.cold.dao.RdcUserMapper;
import com.smartcold.manage.cold.entity.Rdc;
import com.smartcold.manage.cold.entity.RdcUser;
import com.smartcold.manage.cold.service.RdcService;

@Service
public class RdcServiceImpl implements RdcService {

	@Autowired
	private RdcUserMapper rdcUserDao;

	@Autowired
	private RdcMapper rdcDao;

	@Override
	public List<Rdc> findRdcByUserid(int userid) {
		RdcUser rdcUser = rdcUserDao.findByUserId(userid);
		if (rdcUser == null) {
			return null;
		} else {
			return rdcDao.findRDCByRDCId(rdcUser.getRdcid());
		}
	}

}
