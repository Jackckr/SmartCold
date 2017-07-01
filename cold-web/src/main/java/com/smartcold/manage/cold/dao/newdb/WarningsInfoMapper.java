package com.smartcold.manage.cold.dao.newdb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.WarningsInfo;

public interface WarningsInfoMapper {

	public void addwarningsinfos(List<WarningsInfo> warningsInfos);
	public List<WarningsInfo> findAllWarningInfo(int rdcId);
	
	public List<WarningsInfo> findLastNWarningInfo(@Param("rdcId") int rdcId, @Param("point") int point);
	
	public List<HashMap<String, Object>> getWarCountByHPO(@Param("rdcId")int rdcId, @Param("stTime") String stTime, @Param("edTime")String edTime);
}
