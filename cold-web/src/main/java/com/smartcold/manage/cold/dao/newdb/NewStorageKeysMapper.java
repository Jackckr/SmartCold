package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.StorageKeysEntity;

public interface NewStorageKeysMapper {
	List<StorageKeysEntity> findAll();
	
	boolean saveOrUpdateByType(StorageKeysEntity storageKeys);
}
