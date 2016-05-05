package com.smartcold.manage.cold.service.impl;

import com.smartcold.manage.cold.dao.ColdStorageDoorMapper;
import com.smartcold.manage.cold.dao.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.entity.ColdStorageDoorEntity;
import com.smartcold.manage.cold.entity.ColdStorageDoorSetEntity;
import com.smartcold.manage.cold.service.ColdStorageDoorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 10:38)
 */
@Service
public class ColdStorageDoorServiceImpl implements ColdStorageDoorService {

	@Autowired
	private ColdStorageDoorMapper coldStorageDoorDao;

	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetDao;

	@Override
	public List<ColdStorageDoorEntity> findByStorageId(int storageID, int npoint) {
		List<ColdStorageDoorSetEntity> setList = coldStorageDoorSetDao.findLastNPoint(storageID, 1);
		int doorId = setList.get(0).getId();
		List<ColdStorageDoorEntity> results = coldStorageDoorDao.findLastNPoint(doorId, npoint);
		return results;
	}

	@Override
	public List<ColdStorageDoorEntity> findOpenTimeByStorageId(int storageID, Date startTime, Date endTime) {
		List<ColdStorageDoorSetEntity> doors = coldStorageDoorSetDao.findLastNPoint(storageID, 100);
		List<Integer> doorIds = new ArrayList<Integer>();

		for (ColdStorageDoorSetEntity door : doors) {
			doorIds.add(door.getId());
		}

		List<ColdStorageDoorEntity> doorInfos = coldStorageDoorDao.findInfoByIdTime(doorIds, startTime, endTime);

		for (ColdStorageDoorEntity doorInfo : doorInfos) {
			doorInfo.setState(doorInfo.getState() * 30);
		}

		return doorInfos;
	}

	@Override
	public List<ColdStorageDoorEntity> findOpenTimesByStorageId(int storageID, Date startTime, Date endTime) {
		List<ColdStorageDoorSetEntity> doors = coldStorageDoorSetDao.findLastNPoint(storageID, 100);
		List<Integer> doorIds = new ArrayList<Integer>();

		for (ColdStorageDoorSetEntity door : doors) {
			doorIds.add(door.getId());
		}

		return coldStorageDoorDao.findInfoByIdTime(doorIds, startTime, endTime);
	}
}
