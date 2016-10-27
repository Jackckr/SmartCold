package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.WarningsInfo;

public interface WarningsInfoMapper {

	public List<WarningsInfo> findAllWarningInfo(int rdcId);
	

	public List<WarningsInfo> getWrnType( @Param("rdcId")int rdcId,@Param("month") int month);
	
	public List<WarningsInfo> findLastNWarningInfo(@Param("rdcId") int rdcId, @Param("point") int point);
	
	
	public List<WarningsInfo> getWarCountByType(@Param("rdcId")int rdcId,  @Param("jtime")int jtime,@Param("wartype") String wartype, @Param("stTime") String stTime, @Param("enTime")String enTime);
}
