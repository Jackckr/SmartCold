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
	public ItemValue getMAITempData(int oid,int cid, int typpe,String deviceid, String starttime, String endtime) {
		String mv=typpe==0?" MAX(`value`) ":"MIN(`value`) ";String 
		table=StringUtil.isnotNull(deviceid)?"`storagedatacollection`":" `temp`";
	    return	this.tempWarningMapper.getMAITempData(table,mv, deviceid,  starttime, endtime);
	}

	
	

		
}