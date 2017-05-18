package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;


/**
 * 
 * @author Administrator
 *
 */
public interface TempWarningService {
	
	//1.获得监控温度的冷库信息
	List<ColdStorageSetEntity> getAllMonitorTempSet();
	
	//2.获得最大温度dev
	ItemValue getMAITempData(int tid,int cid,int typpe,String deviceid,String starttime,String endtime);
		
}