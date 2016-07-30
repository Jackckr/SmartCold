package com.smartcold.manage.cold.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.RdcUserMapper;
import com.smartcold.manage.cold.dao.StorageKeyValueMapper;
import com.smartcold.manage.cold.dao.UserMapper;
import com.smartcold.manage.cold.entity.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.RdcUser;
import com.smartcold.manage.cold.entity.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;

@Service
public class StorageServiceImpl implements StorageService {

	@Autowired
	StorageKeyValueMapper storageKeyValueDao;
	
	@Autowired
	private RdcUserMapper rdcUserDao;
	
	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;
	
	private static StorageType storageTemp = StorageType.STORAGE_TEMP;
	
	@Override
	public List<StorageKeyValue> findTempByTime(Integer oid, Date startTime, Date endTime) {
		return storageKeyValueDao.findByTime(storageTemp.getTable(), oid, storageTemp.toString(), startTime, endTime);
	}

	@Override
	public List<StorageKeyValue> findTempByNums(Integer oid, Integer nums) {
		return storageKeyValueDao.findByNums(storageTemp.getTable(), oid, storageTemp.toString(), nums);
	}

	@Override
	public List<ColdStorageSetEntity> findByUserId(int userId) {
		RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userId));
		if(rdcUser==null)return null;
		return coldStorageSetDao.findByRdcId(rdcUser.getRdcid());
	}
}
