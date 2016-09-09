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
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.RdcUserMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.RdcUser;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.service.StorageService;

@Service
public class StorageServiceImpl implements StorageService {

	@Autowired
	private RdcUserMapper rdcUserDao;

	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;

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
	public List<Object> findobjByFilter(int type, int oid, String key, String colm,Date startTime, Date endTime) {
		HashMap<String,Object> filter=new HashMap<String, Object>();
		filter.put("type", type);
		filter.put("oid", oid);
		filter.put("key", key);
		filter.put("colm", colm);
		filter.put("startTime", startTime);
		filter.put("endTime", endTime);
		return storageDataCollectionDao.findobjByFilter(filter);
	}
	
	/**
	 * 1. SELECT * FROM `deviceObjectMapping` WHERE `type` = #{type} AND `oid` = #{oid}->deviceid
	 * 
	 * 2. SELECT * FROM storagedatacollection
	    WHERE 1 =1
	    <if test="apid != null">
		    AND `apid` = #{apid} 
	    </if>
	    <if test="deviceid != null">
		    AND `deviceid` = #{deviceid} 
	    </if>
	    <if test="key != null">
		    AND `key` = #{key} 
	    </if>
	    AND time > #{startTime} AND time &lt; #{endTime} 
	    ORDER BY `time` DESC	
	 *
	 * select * from ${table} where `key`=#{key} AND oid=#{oid} AND `addtime` >= #{startTime} AND `addtime` <![CDATA[ < ]]> #{endTime} order by `addtime` desc
	 * 	    select * from ${table} where `key`=#{key} AND oid=#{oid} AND `addtime` >= #{startTime} AND `addtime` <![CDATA[ < ]]> #{endTime} order by `addtime` desc
	 * 
	 * 
	 */
	@Override
	public List<StorageKeyValue> findStorageByFilter(HashMap<String, Object> filter) {
  //  
		
     return null;
	}
}
