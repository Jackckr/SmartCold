package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public interface StorageDataCollectionMapper {

	void batchInsert(List<StorageDataCollectionEntity> batchEntity);

	List<StorageKeyValue> findLastNPoint(@Param("apid") String apid, @Param("deviceid") String deviceid,
			@Param("key") String key, @Param("limit") int limit);

	List<StorageKeyValue> findByTime(@Param("apid") String apid, @Param("deviceid") String deviceid,
			@Param("key") String key, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
	
}
