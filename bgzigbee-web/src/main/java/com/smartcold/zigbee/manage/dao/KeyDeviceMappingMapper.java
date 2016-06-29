package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.KeyDeviceMappingEntity;

public interface KeyDeviceMappingMapper {

	public List<KeyDeviceMappingEntity> findByKey(@Param("key") String key);
	
	public List<KeyDeviceMappingEntity> findByKeypre(@Param("keypre") String keypre);

	public List<KeyDeviceMappingEntity> findByDevice(@Param("deviceid") String deviceid);

}
