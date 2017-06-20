package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.TempWarningMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.service.TempWarningService;
import com.smartcold.manage.cold.util.StringUtil;

/**
 * 
 * @author Administrator
 *
 */
@Service("TempWarningService")
public class TempWarningServiceImpl  implements TempWarningService  {

	@Autowired
	private TempWarningMapper tempWarningMapper;
	
	
	@Override
	public List<ColdStorageSetEntity> getAllMonitorTempSet() {
		return this.tempWarningMapper.getAllMonitorTempSet();
	}

	@Override
	public ItemValue getOverStrtTime(int oid,  float mintemp,String deviceid, String starttime, String endtime) {
		return	this.tempWarningMapper.getOverStrtTime(StringUtil.isnotNull(deviceid)?"storagedatacollection":"temp", deviceid, oid, mintemp, starttime, endtime);
	}
	
	@Override
	public ItemValue getMAITempData(String tids, int typpe,String deviceid, String starttime, String endtime) {
	    return	this.tempWarningMapper.getMAITempData(StringUtil.isnotNull(deviceid)?"storagedatacollection":"temp",typpe==0?" MIN(`value`) ":" MAX(`value`) ", deviceid,tids,starttime, endtime);
	}

	@Override
	public List<ItemValue> getOverTempList(int oid, Float mintemp,String deviceid, String starttime, String endtime) {
		  return	this.tempWarningMapper.getOverTempList(StringUtil.isnotNull(deviceid)?"storagedatacollection":"temp", deviceid,oid, mintemp, starttime, endtime);
	}


	
	

		
}