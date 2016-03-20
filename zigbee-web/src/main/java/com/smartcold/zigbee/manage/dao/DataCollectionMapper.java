package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.DataCollectionEntity;

public interface DataCollectionMapper {

	public List<DataCollectionEntity> findByDeviceID(@Param("deviceID") String deviceID);

	public List<DataCollectionEntity> findByDeviceApID(@Param("deviceID") String deviceID, @Param("apID") String apID);

	public void add(DataCollectionEntity dataCollectionEntity);
}
