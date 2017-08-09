package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public interface StorageKeyValueMapper {
	
	boolean haveKey(@Param("table")String table, @Param("key")String key);
	
	List<StorageKeyValue> findByNums(@Param("table")String table , @Param("oid") Integer oid,@Param("key")String key,@Param("startTime")Date startTime, @Param("endTime")Date endTime, @Param("nums")Integer nums);
	
	List<StorageKeyValue> findByTime(@Param("table")String table, @Param("oid") Integer oid,@Param("key")String key,@Param("startTime")Date startTime, @Param("endTime")Date endTime,@Param("orderBy" )String orderBy);
	
	List<StorageKeyValue> findByTimeFormat(@Param("table")String table, @Param("oid") Integer oid, @Param("key")String key,@Param("startTime")Date startTime, @Param("endTime")Date endTime,@Param("dateFormat")String dateFormat,@Param("orderBy")String orderBy);
}
