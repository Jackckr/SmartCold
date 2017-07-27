package com.smartcold.manage.cold.dao.newdb;

import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;

import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

public interface DeviceObjectMappingMapper {
	
	public boolean delById(@Param("id") int id);
	public boolean resetDevByID(@Param("ids") String ids);
	public boolean insert(DeviceObjectMappingEntity deviceObjectMappingEntity);
	
	public Integer getplcByrdcid(@Param("rdcId") int rdcId);

	public void upDeviceObjectStatus(HashMap<String, Object> data);
	public void upDeviceObjectMapping(DeviceObjectMappingEntity deviceObjectMappingEntity);
	
	public DeviceObjectMappingEntity findInfoByDeviceId(@Param("deviceId") String deviceId);//数据仅返回1条
	public DeviceObjectMappingEntity findByTypeAndOid(@Param("type") int type, @Param("oid")int oid);
	
	public List<HashMap<String, Object>> getBJLowPower( @Param("starttime")String starttime);
	public List<HashMap<String, Object>> getZSLowPower( @Param("starttime")String starttime);
	
	public List<DeviceObjectMappingEntity>  findInfoByRdcId(@Param("rdcId") int rdcId);
	public List<DeviceObjectMappingEntity>  findInfoByfilter(HashMap<String, Object> filter);
	public List<DeviceObjectMappingEntity>  findByTypeOid(@Param("type") int type, @Param("oid")int oid);
	public List<DeviceObjectMappingEntity>  findByTypeOids(@Param("type") int type, @Param("oid")String oid);
	public List<DeviceObjectMappingEntity>  findByTypeDeviceId(@Param("type") int type, @Param("deviceid")String deviceid);
	
}
