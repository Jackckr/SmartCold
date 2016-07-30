package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.StorageKeyValue;

public interface StorageService {
	List<StorageKeyValue> findTempByTime(Integer oid, Date startTime, Date endTime);
	
	List<StorageKeyValue> findTempByNums(Integer oid, Integer nums);
	
	List<ColdStorageSetEntity> findByUserId(int userId);
}
