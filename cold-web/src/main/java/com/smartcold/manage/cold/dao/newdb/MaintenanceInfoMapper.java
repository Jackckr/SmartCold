package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.MaintenanceInfo;



public interface MaintenanceInfoMapper {
	
	public int addMaintenanceInfo(MaintenanceInfo obj);
	
	public int delMaintenanceById(@Param("id")Integer id);
	
	public List<MaintenanceInfo> getMaintenanceById(@Param("id")Integer id);
	
	
	
}
