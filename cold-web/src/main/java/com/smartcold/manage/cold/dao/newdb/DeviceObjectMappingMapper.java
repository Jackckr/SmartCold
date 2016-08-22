package com.smartcold.manage.cold.dao.newdb;

import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface DeviceObjectMappingMapper {

	public DeviceObjectMappingEntity findInfoByTypeOid(@Param("type") int type, @Param("oid") int oid);

	public DeviceObjectMappingEntity findInfoByDeviceId(@Param("deviceId") int deviceId);

	List<DeviceObjectMappingEntity> findByTypeOid(@Param("type") int type, @Param("oid")int oid);

	boolean insert(DeviceObjectMappingEntity deviceObjectMappingEntity);

	boolean delById(@Param("id") int id);
}
