package com.smartcold.bgzigbee.manage.sc360.dao;


import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.sc360.entity.DeviceObjectMappingEntity;

public interface DeviceObjectMappingMapper {
	
	public boolean delById(@Param("id") int id);
	
	public boolean insert(DeviceObjectMappingEntity deviceObjectMappingEntity);
	
	public DeviceObjectMappingEntity findInfoByDeviceId(@Param("deviceId") int deviceId);
	
	public void upDeviceObjectMapping(DeviceObjectMappingEntity deviceObjectMappingEntity);
	
	public void upDeviceObjectStatus(@Param("status") int status,@Param("id") int id);
	
	public Double getDevstatusByKey( @Param("deviceid")String deviceid,@Param("key")String key);//获得设备最新状态
	
	public Page<DeviceObjectMappingEntity> findAllDevice(@Param("keyword") String keyword,@Param("audit") Integer audit);

	public List<DeviceObjectMappingEntity> findByTypeOid(@Param("type") int type, @Param("oid")int oid);
	
	public List<DeviceObjectMappingEntity> findByTypeDeviceId(@Param("type") int type, @Param("deviceid")String deviceid);
	
	public List<DeviceObjectMappingEntity>  findInfoByfilter(@Param("type") Integer type, @Param("status")Integer status,@Param("oid")String oid,@Param("rdcid")Integer rdcid);
}
