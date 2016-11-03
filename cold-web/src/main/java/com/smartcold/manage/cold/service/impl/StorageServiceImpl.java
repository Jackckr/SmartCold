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
		DeviceObjectMappingEntity deviceEntity = deviceObjectMappingDao.findInfoByTypeOid(type, oid);
		if (deviceEntity != null) {
			return storageDataCollectionDao.findLastNPoint(null, deviceEntity.getDeviceid(), key, nums);
		} else {
			String table = StorageType.getStorageType(type).getTable();
			List<StorageKeyValue> result = storageKeyValueDao.findByNums(table, oid, key, nums);
			return result;
		}
	}

	@Override
	public List<StorageKeyValue> findByNums(StorageType stype, int oid, String key, int nums) {
		DeviceObjectMappingEntity deviceEntity = deviceObjectMappingDao.findInfoByTypeOid(stype.getType(), oid);
		if (deviceEntity != null) {
			return storageDataCollectionDao.findLastNPoint(null, deviceEntity.getDeviceid(), key, nums);
		} else {
			return storageKeyValueDao.findByNums(stype.getTable(), oid, key, nums);
		}
	}

	@Override
	public List<StorageKeyValue> findByTime(int type, int oid, String key, Date startTime, Date endTime) {
		DeviceObjectMappingEntity deviceEntity = deviceObjectMappingDao.findInfoByTypeOid(type, oid);
		if (deviceEntity != null) {
			return storageDataCollectionDao.findByTime(null, deviceEntity.getDeviceid(), key, startTime, endTime);
		} else {
			return storageKeyValueDao.findByTime(StorageType.getStorageType(type).getTable(), oid, key, startTime,endTime);
		}
	}
	
	@Override
	public List<StorageKeyValue> findByTimeFormat(int type, int oid, String key, Date startTime, Date endTime,int daysBetween,String dateFormat,String orderBy) {
		DeviceObjectMappingEntity deviceEntity = deviceObjectMappingDao.findInfoByTypeOid(type, oid);
		if (deviceEntity != null) {
			if(daysBetween<=3){
				return storageDataCollectionDao.findByTimeFormat(null, deviceEntity.getDeviceid(), key, startTime, endTime,dateFormat,orderBy);
			}else{
				return storageDataCollectionDao.findByTimeFormat1(null, deviceEntity.getDeviceid(), key, startTime, endTime,dateFormat,orderBy);
			}
		} else {
			if(daysBetween<=3){
				return storageKeyValueDao.findByTimeFormat(StorageType.getStorageType(type).getTable(), oid, key, startTime,endTime,dateFormat,orderBy);
			}else{
				return storageKeyValueDao.findByTimeFormat1(StorageType.getStorageType(type).getTable(), oid, key, startTime,endTime,dateFormat,orderBy);
			}
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
