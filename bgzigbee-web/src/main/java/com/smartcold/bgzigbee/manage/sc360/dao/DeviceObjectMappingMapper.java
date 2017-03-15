package com.smartcold.bgzigbee.manage.sc360.dao;


import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.sc360.entity.DeviceObjectMappingEntity;

public interface DeviceObjectMappingMapper {
	
	public void upDeviceObjectStatus(@Param("status") int status,@Param("id") int id);
	
	public Page<DeviceObjectMappingEntity> findAllDevice(@Param("keyword") String keyword,@Param("audit") Integer audit);
	
	public boolean delById(@Param("id") int id);
	

	public boolean insert(DeviceObjectMappingEntity deviceObjectMappingEntity);

//	public void upDeviceObjectStatus(HashMap<String, Object> data);
	
	public void upDeviceObjectMapping(DeviceObjectMappingEntity deviceObjectMappingEntity);
	
	public List<DeviceObjectMappingEntity>  findInfoByfilter(HashMap<String, Object> filter);
	
	public DeviceObjectMappingEntity findInfoByDeviceId(@Param("deviceId") int deviceId);
	

	public List<DeviceObjectMappingEntity> findByTypeOid(@Param("type") int type, @Param("oid")int oid);
	
	public List<DeviceObjectMappingEntity> findByTypeDeviceId(@Param("type") int type, @Param("deviceid")String deviceid);
}
