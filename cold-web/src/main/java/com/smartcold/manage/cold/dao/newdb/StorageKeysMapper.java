package com.smartcold.manage.cold.dao.newdb;

import com.smartcold.manage.cold.entity.newdb.StorageKeysEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StorageKeysMapper {
	
	boolean deleteById(@Param("id")int id);
	
	boolean save(StorageKeysEntity storageKeys);
	
	List<StorageKeysEntity> findAll();
	
	List<StorageKeysEntity> findbyFilter(@Param("types")String  types,@Param("keys")String keys);
}
