package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public interface StorageKeyValueMapper {
	
	List<StorageKeyValue> findByTime(@Param("table")String table, @Param("oid") Integer oid,
			@Param("key")String key,@Param("startTime")Date startTime, @Param("endTime")Date endTime);
	
	List<StorageKeyValue> findByNums(@Param("table")String table , @Param("oid") Integer oid,
			@Param("key")String key, @Param("nums")Integer nums);
	
	boolean haveKey(@Param("table")String table, @Param("key")String key);
	
	List<StorageKeyValue> findByTimeFormat(@Param("table")String table, @Param("oid") Integer oid, @Param("key")String key,@Param("startTime")Date startTime, @Param("endTime")Date endTime,@Param("dateFormat")String dateFormat,@Param("orderBy")String orderBy);
//	List<StorageKeyValue> findByTimeFormat1(@Param("table")String table, @Param("oid") Integer oid, @Param("key")String key,@Param("startTime")Date startTime, @Param("endTime")Date endTime,@Param("dateFormat")String dateFormat,@Param("orderBy")String orderBy);
}
