package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.entity.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;

public interface StorageService {
	
	List<ColdStorageSetEntity> findByUserId(int userId);
	
	List<StorageKeyValue> findByNums(int type, int oid, String key, int nums);
	
	List<StorageKeyValue> findByNums(StorageType stype, int oid, String key, int nums);
}
