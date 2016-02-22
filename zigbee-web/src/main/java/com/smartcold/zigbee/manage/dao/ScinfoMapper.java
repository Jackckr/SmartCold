package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.ScInfoDeviceEntity;
import com.smartcold.zigbee.manage.entity.ScinfoEntity;

public interface ScinfoMapper {

	public List<ScinfoEntity> findInfoByKey(@Param("key") String key);
	
	public ScinfoEntity findOneInfoByKey(@Param("key") String key);
	
	public List<ScInfoDeviceEntity> findInfoDeviceByKey(@Param("key") String key);
}
