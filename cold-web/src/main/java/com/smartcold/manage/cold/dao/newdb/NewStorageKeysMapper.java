package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.NewStorageKeysEntity;

public interface NewStorageKeysMapper {
	List<NewStorageKeysEntity> findAll();
	
	boolean saveOrUpdateByType(NewStorageKeysEntity storageKeys);
}
