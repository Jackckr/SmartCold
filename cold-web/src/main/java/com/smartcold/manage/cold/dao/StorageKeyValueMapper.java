package com.smartcold.manage.cold.dao;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.StorageKeyValue;

public interface StorageKeyValueMapper {
	
	List<StorageKeyValue> findByTime(@Param("table")String table, @Param("oid") Integer oid,
			@Param("key")String key,@Param("startTime")Date startTime, @Param("endTime")Date endTime);
	
	List<StorageKeyValue> findByNums(@Param("table")String table , @Param("oid") Integer oid,
			@Param("key")String key, @Param("nums")Integer nums);
}
