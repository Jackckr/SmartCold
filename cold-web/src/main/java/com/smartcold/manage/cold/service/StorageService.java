package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.enums.StorageType;

public interface StorageService {
	
	List<ColdStorageSetEntity> findByUserId(int userId);
	
	List<StorageKeyValue> findByNums(int type, int oid, String key, int nums);
	
	List<StorageKeyValue> findByNums(StorageType stype, int oid, String key, int nums);
	
	List<StorageKeyValue> findByTime(int type, int oid, String key, Date startTime, Date endTime);
}
