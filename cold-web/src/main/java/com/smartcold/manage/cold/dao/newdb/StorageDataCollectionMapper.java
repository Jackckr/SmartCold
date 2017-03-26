package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public interface StorageDataCollectionMapper {

	void batchInsert(List<StorageDataCollectionEntity> batchEntity);

	List<StorageKeyValue> findLastNPoint(@Param("apid") String apid, @Param("deviceid") String deviceid,@Param("key") String key, @Param("limit") int limit,@Param("startTime")Date startTime);

	Integer findCounSizeByTime(@Param("apid") String apid, @Param("deviceid") String deviceid,@Param("key") String key, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
	
	List<StorageKeyValue> findByTime(@Param("apid") String apid, @Param("deviceid") String deviceid,@Param("key") String key, @Param("startTime") Date startTime, @Param("endTime") Date endTime,@Param("orderBy"  )String orderBy);//
	
	List<StorageKeyValue> findByTimeFormat(@Param("apid") String apid, @Param("deviceid") String deviceid,@Param("key") String key, @Param("startTime") Date startTime, @Param("endTime") Date endTime,@Param("dateFormat")String dateFormat,@Param("orderBy")String orderBy);
	
//	List<StorageKeyValue> findByTimeFormat1(@Param("apid") String apid, @Param("deviceid") String deviceid,@Param("key") String key, @Param("startTime") Date startTime, @Param("endTime") Date endTime,@Param("dateFormat")String dateFormat,@Param("orderBy")String orderBy);
	
}
