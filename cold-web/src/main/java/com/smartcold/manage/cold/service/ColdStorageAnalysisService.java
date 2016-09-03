package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;

public interface ColdStorageAnalysisService {

	public Map<String, List<ColdStorageAnalysisEntity>> findValueByDateKeys(int type, int oid, List<String> keys,
			Date startTime, Date endTime);
}
