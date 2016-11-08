package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.enums.StorageType;

public interface StorageService {

	List<ColdStorageSetEntity> findByUserId(int userId);

	List<StorageKeyValue> findByNums(int type, int oid, String key, int nums);

	List<StorageKeyValue> findByNums(StorageType stype, int oid, String key, int nums);

	List<StorageKeyValue> findByTime(int type, int oid, String key, Date startTime, Date endTime);
	
	Integer findCounSizeByTime(int type, int oid, String deviceid,String key, Date startTime, Date endTime);
	
    List<StorageKeyValue> findByTimeFormat(int type, int oid, String key, Date startTime, Date endTime,int daysBetween,String dateFormat,String orderBy);
//	
    
    Map<String, Map<String, List<ColdStorageAnalysisEntity>>> findDoorSisByRdcidKeyDate(int rdcid, List<String> keys, Date startTime, Date endTime) ;
    
	Map<String, Map<String, List<ColdStorageAnalysisEntity>>> findAnalysisByRdcidKeyDate(int rdcid, List<String> keys, Date startTime, Date endTime);
	
	
}
