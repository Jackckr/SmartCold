package com.smartcold.manage.cold.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.StorageKeyValueMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;

@Service
public class StorageServiceImpl implements StorageService {

	
	@Autowired
	private RdcUserMapper rdcUserDao;
	
	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;
	
	@Autowired
	private StorageKeyValueMapper storageKeyValueDao;
	
	@Override
	public List<ColdStorageSetEntity> findByUserId(int userId) {
		RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userId));
		if(rdcUser==null)return null;
		return coldStorageSetDao.findByRdcId(rdcUser.getRdcid());
	}

	@Override
	public List<StorageKeyValue> findByNums(int type, int oid, String key, int nums) {
		String table  = StorageType.getStorageType(type).getTable();
		List result = storageKeyValueDao.findByNums(table, oid, key, nums);
		return result;
	}

	@Override
	public List<StorageKeyValue> findByNums(StorageType stype, int oid, String key, int nums) {
		return storageKeyValueDao.findByNums(stype.getTable(), oid, key, nums);
	}

	@Override
	public List<StorageKeyValue> findByTime(int type, int oid, String key, Date startTime, Date endTime) {
		
		return storageKeyValueDao.findByTime(StorageType.getStorageType(type).getTable(), 
				oid, key, startTime, endTime);
	}
}
