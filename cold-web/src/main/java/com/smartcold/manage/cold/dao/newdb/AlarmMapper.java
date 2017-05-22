package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;


public interface AlarmMapper {
	
	List<ColdStorageAnalysisEntity> getSumValueByFilter(@Param("type")Integer type,@Param("oids")String oids, @Param("keys")String keys,@Param("startTime")String startTime,@Param("endTime")String endTime );

	
}
