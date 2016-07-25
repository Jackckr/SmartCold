package com.smartcold.manage.cold.dao;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.StorageDataCollectionEntity;

public interface StorageDataCollectionMapper {

	void batchInsert(List<StorageDataCollectionEntity> batchEntity);

	List<StorageDataCollectionEntity> findLastNPoint(@Param("apid") String apid, @Param("key") String key,
			@Param("limit") int limit);

	List<StorageDataCollectionEntity> findByTime(@Param("apid") String apid, @Param("deviceid") String deviceid,
			@Param("key") String key, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
}
