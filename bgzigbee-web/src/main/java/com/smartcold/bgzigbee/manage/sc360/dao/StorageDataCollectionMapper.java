package com.smartcold.bgzigbee.manage.sc360.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.StorageDataCollectionEntity;

public interface StorageDataCollectionMapper {
	//AP状态数据
	Page<StorageDataCollectionEntity> findAPByFilter(@Param("apid") String apid,@Param("key") String key,@Param("startTime") String startTime,@Param("endTime") String endTime);
    //DEV状态数据
	Page<StorageDataCollectionEntity> findDVByFilter(@Param("apid") String apid,@Param("deviceid") String deviceid,@Param("key") String key,@Param("startTime") String startTime,@Param("endTime") String endTime);
	//DEV数据
	Page<StorageDataCollectionEntity> findDTByFilter(@Param("apid") String apid,@Param("deviceid") String deviceid,@Param("key") String key,@Param("startTime") String startTime,@Param("endTime") String endTime);
   
}