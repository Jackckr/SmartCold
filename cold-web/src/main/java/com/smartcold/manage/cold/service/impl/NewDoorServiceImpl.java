package com.smartcold.manage.cold.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.StorageKeyValueMapper;
import com.smartcold.manage.cold.entity.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.NewDoorService;

@Service
public class NewDoorServiceImpl implements NewDoorService {
	
	private static StorageType storageDoor = StorageType.STORAGE_DOOR;
	
	@Autowired
	StorageKeyValueMapper storageKeyValueDao;

	@Override
	public List<StorageKeyValue> getDoorStatusByNums(Integer oid, Integer nums) {
		return storageKeyValueDao.findByNums(storageDoor.getTable(), oid, storageDoor.toString(), nums);
	}

	@Override
	public List<StorageKeyValue> getDoorStatusByTime(Integer oid, Date startTime, Date endTime) {
		return storageKeyValueDao.findByTime(storageDoor.getTable(), oid, storageDoor.toString(), startTime, endTime);
	}

}
