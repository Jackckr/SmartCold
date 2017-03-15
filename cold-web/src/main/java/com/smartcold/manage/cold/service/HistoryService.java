package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;



/**
 * 多键值（Temp,Switch）
 *   
 * @author maqiang34
 *
 */
public interface HistoryService {

	
	public List<StorageKeyValue> getBigData(int type,String key, int oid, Date startTime, Date endTime) ;
	
}
