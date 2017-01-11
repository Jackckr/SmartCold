package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.entity.olddb.ColdStorageDoorEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageDoorSetEntity;
import com.smartcold.manage.cold.service.ColdStorageDoorService;

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
	public List<ColdStorageDoorSetEntity> findByStorageId(int storageID) {

		return coldStorageDoorSetDao.findByStorageId(storageID);
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
