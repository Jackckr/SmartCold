package com.smartcold.manage.cold.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.service.HistoryService;

@Service
public class HistoryServiceImpl implements HistoryService {

//	@Autowired
//	private StorageKeyValueMapper storageKeyValueDao;
//	@Autowired
//	private DeviceObjectMappingMapper deviceObjectMappingDao;
//	@Autowired
//	private StorageDataCollectionMapper storageDataCollectionDao;
//	
//	public Map<String, List<StorageKeyValue>> findMultiValueByTime(int type,String key, int [] oids,String []names, Date startTime, Date endTime) {
//		    Map<String, List<StorageKeyValue>> resdata=new HashMap<String, List<StorageKeyValue>>();
//			List<DeviceObjectMappingEntity> devList = deviceObjectMappingDao.findByTypeOids(type,StringUtil.getIdS(oids));
//			 if (SetUtil.isnotNullList(devList)) {
//				  for (int i = 0; i < devList.size(); i++) {
//					  DeviceObjectMappingEntity dev = devList.get(i);
//					  resdata.put(key+names[i], storageDataCollectionDao.findByTimeFormat(null, dev.getDeviceid(), key, startTime, endTime,null," asc"));
//			      }			 
//			} else {
//				for (int i = 0; i < oids.length; i++) {
//				 	List<StorageKeyValue> findByTime = storageKeyValueDao.findByTimeFormat(StorageType.getStorageType(type).getTable(), oids[i], key, startTime,endTime,null," asc");
//					 resdata.put(key+names[i], findByTime);
//			      }	
//		     }
//		return resdata;
//	}

	@Override
	public List<StorageKeyValue> getBigData(int type, String key, int oid,Date startTime, Date endTime) {
		
//		SELECT * FROM product WHERE ID > =(select id from product limit 866613, 1) limit 100000
//		List<DeviceObjectMappingEntity> devList = deviceObjectMappingDao.findByTypeOid(type,oid);
//		 if (SetUtil.isnotNullList(devList)) {
//			  for (int i = 0; i < devList.size(); i++) {
//				  DeviceObjectMappingEntity dev = devList.get(i);
//				  resdata.put(key+names[i], storageDataCollectionDao.findByTimeFormat(null, dev.getDeviceid(), key, startTime, endTime,null," asc"));
//		      }			 
//		} else {
//			for (int i = 0; i < oids.length; i++) {
//			 	List<StorageKeyValue> findByTime = storageKeyValueDao.findByTimeFormat(StorageType.getStorageType(type).getTable(), oids[i], key, startTime,endTime,null," asc");
//				 resdata.put(key+names[i], findByTime);
//		      }	
//	     }
		
		
		// TODO Auto-generated method stub
		return null;
	}
	

	
}
