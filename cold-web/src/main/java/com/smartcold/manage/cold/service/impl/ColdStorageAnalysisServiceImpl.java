package com.smartcold.manage.cold.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.ColdStorageAnalysisMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;

@Service
public class ColdStorageAnalysisServiceImpl implements ColdStorageAnalysisService {

	@Autowired
	private ColdStorageAnalysisMapper analysisDao;


	@Override
	public List<ColdStorageAnalysisEntity> findValueByFilter(HashMap<String, Object> filter) {
		return this.analysisDao.findValueByFilter(filter);
	}
	
	
	@Override
	public List<ColdStorageAnalysisEntity> findValueByDateKeys(int type, int oid, String key, Date startTime, Date endTime) {
		List<String> keys = Arrays.asList(key);
		Map<String, List<ColdStorageAnalysisEntity>> results = findValueByDateKeys(type, oid, keys, startTime, endTime);
		return results.get(key);
	}
	
	@Override
	public Map<String, List<ColdStorageAnalysisEntity>> findValueByDateKeys(int type, int oid, List<String> keys,Date startTime, Date endTime) {
		HashMap<String, List<ColdStorageAnalysisEntity>> result = new HashMap<String, List<ColdStorageAnalysisEntity>>();
		for (String key : keys) {
			result.put(key, analysisDao.findValueByDate(type, oid, key, startTime, endTime));
		}
		return result;
	}


	@Override
	public Map<String, List<ColdStorageAnalysisEntity>> findDVDataByDate(int type, int oid, List<String> keys, Date startTime, Date endTime) {
		HashMap<String, List<ColdStorageAnalysisEntity>> result = new HashMap<String, List<ColdStorageAnalysisEntity>>();
		for (String key : keys) {
			result.put(key, analysisDao.findDVDataByDate(type, oid, key, startTime, endTime));
		}
		return result;
	}


	



}
