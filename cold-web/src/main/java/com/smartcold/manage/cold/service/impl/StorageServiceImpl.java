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
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageDoorSetEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.SetUtil;

@Service
public class StorageServiceImpl implements StorageService {

	@Autowired
	private RdcUserMapper rdcUserDao;

	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;
	
	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetMapper;

	@Autowired
	private StorageKeyValueMapper storageKeyValueDao;

	@Autowired
	private DeviceObjectMappingMapper deviceObjectMappingDao;

	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;

	@Autowired
	private ColdStorageAnalysisService analysisService;

	@Override
	public List<ColdStorageSetEntity> findByUserId(int userId) {
		RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userId));
		if (rdcUser == null)
			return null;
		return coldStorageSetDao.findByRdcId(rdcUser.getRdcid());
	}

	@Override
	public List<StorageKeyValue> findByNums(int type, int oid, String key, int nums) {
		List<DeviceObjectMappingEntity> deviceList = deviceObjectMappingDao.findByTypeOid(type, oid);
		if (SetUtil.isnotNullList(deviceList)) {
			return storageDataCollectionDao.findLastNPoint(null, deviceList.get(0).getDeviceid(), key, nums);
		} else {
			String table = StorageType.getStorageType(type).getTable();
			List<StorageKeyValue> result = storageKeyValueDao.findByNums(table, oid, key, nums);
			return result;
		}
	}

	@Override
	public List<StorageKeyValue> findByNums(StorageType stype, int oid, String key, int nums) {
		List<DeviceObjectMappingEntity> deviceList =deviceObjectMappingDao.findByTypeOid(stype.getType(), oid);
		if (SetUtil.isnotNullList(deviceList)) {
			return storageDataCollectionDao.findLastNPoint(null,  deviceList.get(0).getDeviceid(), key, nums);
		} else {
			return storageKeyValueDao.findByNums(stype.getTable(), oid, key, nums);
		}
	}

	@Override
	public List<StorageKeyValue> findByTime(int type, int oid, String key, Date startTime, Date endTime) {
		List<DeviceObjectMappingEntity> deviceList = deviceObjectMappingDao.findByTypeOid(type, oid);
		if (SetUtil.isnotNullList(deviceList)) {
			return storageDataCollectionDao.findByTime(null,  deviceList.get(0).getDeviceid(), key, startTime, endTime);
		} else {
			return storageKeyValueDao.findByTime(StorageType.getStorageType(type).getTable(), oid, key, startTime,endTime);
		}
	}
	
	@Override
	public Map<String, List<StorageKeyValue>> findTempByTime(int type, int oid,String key, Date startTime, Date endTime) {
		Map<String, List<StorageKeyValue>> resdata=new HashMap<String, List<StorageKeyValue>>();
		 List<DeviceObjectMappingEntity> devList = deviceObjectMappingDao.findByTypeOid(type, oid);
		    if (SetUtil.isnotNullList(devList)) {
		    	for (DeviceObjectMappingEntity dev : devList) {
		    		resdata.put(key+dev.getDeviceid(), storageDataCollectionDao.findByTimeFormat(null, dev.getDeviceid(), key, startTime, endTime,null," asc"));
				}
			} else {
				 List<StorageKeyValue> findByTime = storageKeyValueDao.findByTimeFormat(StorageType.getStorageType(type).getTable(), oid, key, startTime,endTime,null," asc");
				 resdata.put(key, findByTime);
			}
		return resdata;
	}
	
	
	@Override
	public List<StorageKeyValue> findByTimeFormat(int type, int oid, String key, Date startTime, Date endTime,int daysBetween,String dateFormat,String orderBy) {
		List<DeviceObjectMappingEntity> deviceList = deviceObjectMappingDao.findByTypeOid(type, oid);
		if (SetUtil.isnotNullList(deviceList)) {
			return storageDataCollectionDao.findByTimeFormat(null,deviceList.get(0).getDeviceid(), key, startTime, endTime,dateFormat,orderBy);
		} else {
			return storageKeyValueDao.findByTimeFormat(StorageType.getStorageType(type).getTable(), oid, key, startTime,endTime,dateFormat,orderBy);
		}
	}
	
	@Override
	public Integer findCounSizeByTime(int type, int oid, String deviceid,String key, Date startTime, Date endTime){
		return storageDataCollectionDao.findCounSizeByTime(null, deviceid, key, startTime, endTime);
	}
	

	@Override
	public Map<String, Map<String, List<ColdStorageAnalysisEntity>>> findAnalysisByRdcidKeyDate(int rdcid,
			List<String> keys, Date startTime, Date endTime) {
		HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>> result = new HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>>();
		List<ColdStorageSetEntity> storages = coldStorageSetDao.findByRdcId(rdcid);
		for (ColdStorageSetEntity storage : storages) {
			result.put(storage.getName(), analysisService.findValueByDateKeys(StorageType.STORAGE.getType(),
					storage.getId(), keys, startTime, endTime));
		}
		return result;
	}
	
	@Override
	public Map<String, Map<String, List<ColdStorageAnalysisEntity>>> findDoorSisByRdcidKeyDate(int rdcid,
			List<String> keys, Date startTime, Date endTime) {
		HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>> result = new HashMap<String, Map<String, List<ColdStorageAnalysisEntity>>>();
		List<ColdStorageSetEntity> storages = coldStorageSetDao.findByRdcId(rdcid);
		for (ColdStorageSetEntity storage : storages) {
			List<ColdStorageDoorSetEntity> doorset = this.coldStorageDoorSetMapper.findByStorageId(storage.getId());
			if(SetUtil.isnotNullList(doorset)){
				for (ColdStorageDoorSetEntity door : doorset) {
					result.put(storage.getName()+"-"+door.getName(), analysisService.findValueByDateKeys(StorageType.DOOR.getType(),door.getId(), keys, startTime, endTime));
				}
			}
		}
		return result;
	}


	
}
