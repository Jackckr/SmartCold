package com.smartcold.manage.cold.dao.newdb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;

public interface DeviceObjectMappingMapper {

	public DeviceObjectMappingEntity findInfoByTypeOid(@Param("type") int type, @Param("oid") int oid);

	public DeviceObjectMappingEntity findInfoByDeviceId(@Param("deviceId") int deviceId);
}
