package com.smartcold.manage.cold.dao.newdb;

import com.smartcold.manage.cold.entity.newdb.StorageKeysEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StorageKeysMapper {
	List<StorageKeysEntity> findAll();
	
	boolean save(StorageKeysEntity storageKeys);

	boolean deleteById(@Param("id")int id);
}
