package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;
import com.github.pagehelper.Page;
import com.smartcold.manage.cold.entity.olddb.MaintenanceEntity;


public interface MaintenanceMapper {

	int deleteMaintenance(Integer id);
	
	MaintenanceEntity findMaintenanceByID(Integer id);

    int insertMaintenance(MaintenanceEntity maintenanceEntity);

    int updateMaintenance(MaintenanceEntity maintenanceEntity);
	
	Page<MaintenanceEntity> findMaintByRdcId( @Param("rdcId") Integer rdcId , @Param("audit") Integer audit,@Param("keyword") String keyword);
}
