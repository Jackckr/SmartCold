package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.MaintconFirma;
import com.smartcold.manage.cold.entity.newdb.MaintenanceInfo;
import com.smartcold.manage.cold.entity.newdb.MaintorderEntity;



public interface MaintenanceInfoMapper {
	
	public int addMaintenanceInfo(MaintenanceInfo obj);
	
	public int delMaintenanceById(@Param("id")Integer id);
	
	public MaintenanceInfo getMaintenanceByWId(@Param("wid")String wid);
	
	@Deprecated
	public List<MaintenanceInfo> getMaintenanceById(@Param("id")Integer id);
	
	public List<MaintconFirma> getMaintconFirmaByMid(@Param("maintid")Integer maintid);
	
	public List<MaintorderEntity> getMaintorderByMid(@Param("maintid")Integer maintid);
	
	
	public void upMaintenancesCoreById(@Param("id")Integer id, @Param("score")Double score,@Param("evaluate")String evaluate);
	
	
}
