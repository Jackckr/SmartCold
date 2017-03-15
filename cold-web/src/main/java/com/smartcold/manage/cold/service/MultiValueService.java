package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;



/**
 * 多键值（Temp,Switch）
 *   
 * @author maqiang34
 *
 */
public interface MultiValueService {

	public Map<String, List<StorageKeyValue>> findMultiValueByTime(int type,String key, int [] oids,String []names, Date startTime, Date endTime) ;
	
}
