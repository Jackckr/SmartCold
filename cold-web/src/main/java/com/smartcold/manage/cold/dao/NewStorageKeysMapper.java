package com.smartcold.manage.cold.dao;

import java.util.List;

import com.smartcold.manage.cold.entity.NewStorageKeys;

public interface NewStorageKeysMapper {
	List<NewStorageKeys> findAll();
	
	boolean saveOrUpdateByType(NewStorageKeys storageKeys);
}
