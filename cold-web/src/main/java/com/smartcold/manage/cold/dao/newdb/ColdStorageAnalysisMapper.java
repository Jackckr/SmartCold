package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;

public interface ColdStorageAnalysisMapper {
	
	public List<ColdStorageAnalysisEntity> findValueByFilter(HashMap<String, Object> filter);
	
	public List<ColdStorageAnalysisEntity> findValueByDate(@Param("type") int type, @Param("oid") int oid, 	@Param("key") String key, @Param("startTime") Date startTime, @Param("endTime") Date endTime);
}
