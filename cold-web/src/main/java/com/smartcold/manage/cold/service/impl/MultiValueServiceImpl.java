package com.smartcold.manage.cold.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.StorageDataCollectionMapper;
import com.smartcold.manage.cold.dao.newdb.StorageKeyValueMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.MultiValueService;

@Service
public class MultiValueServiceImpl implements MultiValueService {

	@Autowired
	private StorageKeyValueMapper storageKeyValueDao;
	@Autowired
	private DeviceObjectMappingMapper deviceObjectMappingDao;
	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;
	
	public Map<String, List<StorageKeyValue>> findMultiValueByTime(int type,String key, int [] oids,String []names, Date startTime, Date endTime) {
    	Map<String, List<StorageKeyValue>> resdata=new HashMap<String, List<StorageKeyValue>>();
	    for (int i = 0; i < oids.length; i++) {
		   DeviceObjectMappingEntity dev = deviceObjectMappingDao.findByTypeAndOid(type,oids[i]);
		   if(dev!=null){
			  List<StorageKeyValue> findByTimeFormat = this.storageDataCollectionDao.findByTimeFormat(null, dev.getDeviceid(), key, startTime, endTime,null,"asc");
			  resdata.put(names[i],findByTimeFormat );
		   }else{
		 	 List<StorageKeyValue> findByTime = this.storageKeyValueDao.findByTimeFormat(StorageType.getStorageType(type).getTable(), oids[i], key, startTime,endTime,null,"asc");
			 resdata.put(names[i], findByTime);
		   }
	   }
    	return resdata;
	}
	

	
}
