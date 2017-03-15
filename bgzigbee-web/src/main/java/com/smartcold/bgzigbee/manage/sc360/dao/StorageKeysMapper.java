package com.smartcold.bgzigbee.manage.sc360.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.sc360.entity.StorageKeysEntity;

import java.util.List;

public interface StorageKeysMapper {
	
	boolean deleteById(@Param("id")int id);
	
	boolean save(StorageKeysEntity storageKeys);
	
	List<StorageKeysEntity> findAll();
	
	List<StorageKeysEntity> findbyFilter(@Param("types")String  types,@Param("keys")String keys);
}
