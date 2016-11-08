package com.smartcold.bgzigbee.manage.sc360.dao;


import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.sc360.entity.DeviceObjectMappingEntity;

public interface DeviceObjectMappingMapper {
	
	public void upDeviceObjectStatus(@Param("status") int status,@Param("id") int id);
	
	public Page<DeviceObjectMappingEntity> findAllDevice(@Param("keyword") String keyword,@Param("audit") int audit);
	
	public boolean delById(@Param("id") int id);
}
