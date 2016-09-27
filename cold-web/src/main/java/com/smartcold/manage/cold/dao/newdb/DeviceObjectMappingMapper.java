package com.smartcold.manage.cold.dao.newdb;

import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;

import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

public interface DeviceObjectMappingMapper {
	
	public boolean delById(@Param("id") int id);

	public boolean insert(DeviceObjectMappingEntity deviceObjectMappingEntity);

	public void upDeviceObjectStatus(HashMap<String, Object> data);
	
	public void upDeviceObjectMapping(DeviceObjectMappingEntity deviceObjectMappingEntity);
	
	public List<DeviceObjectMappingEntity>  findInfoByfilter(HashMap<String, Object> filter);
	
	public DeviceObjectMappingEntity findInfoByDeviceId(@Param("deviceId") int deviceId);
	
	public DeviceObjectMappingEntity findInfoByTypeOid(@Param("type") int type, @Param("oid") int oid);

	public List<DeviceObjectMappingEntity> findByTypeOid(@Param("type") int type, @Param("oid")int oid);
}
