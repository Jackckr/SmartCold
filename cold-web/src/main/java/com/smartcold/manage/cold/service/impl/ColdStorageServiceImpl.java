package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.ColdStorageMapper;
import com.smartcold.manage.cold.dao.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.RdcUserMapper;
import com.smartcold.manage.cold.dto.ColdStorageTemperDTO;
import com.smartcold.manage.cold.entity.ColdStorageEntity;
import com.smartcold.manage.cold.entity.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.RdcUser;
import com.smartcold.manage.cold.service.ColdStorageService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-01 23:31)
 */
@Service
public class ColdStorageServiceImpl implements ColdStorageService {

	@Autowired
	private ColdStorageMapper coldStorageDao;

	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;

	@Autowired
	private RdcUserMapper rdcUserDao;

	@Override
	public List<ColdStorageTemperDTO> getTemperInfoById(int storageID, int npoint) {
		List<ColdStorageTemperDTO> result = Lists.newArrayList();
		List<ColdStorageEntity> list = coldStorageDao.findLastNPoint(storageID, npoint);
		List<ColdStorageSetEntity> setlist = coldStorageSetDao.findLastNPoint(storageID, 1);
		for (ColdStorageEntity coldStorageEntity : list) {
			ColdStorageTemperDTO coldStorageTemperDTO = new ColdStorageTemperDTO();
			coldStorageTemperDTO.setId(coldStorageEntity.getId());
			coldStorageTemperDTO.setTemperature(coldStorageEntity.getTemperature());
			coldStorageTemperDTO.setAddTime(coldStorageEntity.getAddTime());
			coldStorageTemperDTO.setStorageID(coldStorageEntity.getStorageID());
			coldStorageTemperDTO.setTime(coldStorageEntity.getTime());
			coldStorageTemperDTO.setStartTemperature(setlist.get(0).getStartTemperature());
			result.add(coldStorageTemperDTO);
		}
		return result;
	}

	@Override
	public List<ColdStorageSetEntity> findByUserId(int userId) {
		RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userId));
		if(rdcUser==null)return null;
		return coldStorageSetDao.findByRdcId(rdcUser.getRdcid());
	}
}
