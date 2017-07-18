package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;

public interface ColdStorageAnalysisService {

	public List<ColdStorageAnalysisEntity> findValueByFilter(HashMap<String, Object> filter);
	
//	public List<ColdStorageAnalysisEntity> findValueBykey(int type, int oid, String key, Date startTime,	Date endTime);
	
	public List<ColdStorageAnalysisEntity> findValueByDateKeys(int type, int oid, String key, Date startTime,	Date endTime);

	@Deprecated
	public Map<String, List<ColdStorageAnalysisEntity>> findValueByDateKeys(int type, int oid, List<String> keys,Date startTime, Date endTime);
	
	/**
	 * 
	 * @param type
	 * @param oid
	 * @param keys
	 * @param startTime
	 * @param endTime
	 * @return valu,date  默认：asc
	 */
	public Map<String, List<ColdStorageAnalysisEntity>> findDVDataByDate(int type, int oid, List<String> keys,Date startTime, Date endTime);


}
