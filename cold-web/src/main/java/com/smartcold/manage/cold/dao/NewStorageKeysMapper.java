package com.smartcold.manage.cold.dao;

import java.util.List;

import com.smartcold.manage.cold.entity.NewStorageKeysEntity;

public interface NewStorageKeysMapper {
	List<NewStorageKeysEntity> findAll();
	
	boolean saveOrUpdateByType(NewStorageKeysEntity storageKeys);
}
