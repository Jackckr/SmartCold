package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.WarningsLog;


public interface WarningLogMapper {
	
	
	public List<WarningsLog> findAllWarningLog(int rdcId);
	
	
	/**
	 * 
	 * @param warningsInfoList
	 */
	public void addWarningLog(List<WarningsLog> warningsLogList);
	
	
	/**
	 * L:U:I:Temp
	 * @param startTime
	 */
	public void addWREerrByTime(@Param("startTime")Date startTime);//dev ->電壓檢查  X
	public void addSUerrByTime(@Param("startTime")Date startTime);//dev ->電壓檢查  X
	public void addscollPUerrByTime(@Param("startTime")Date startTime);//PLC ->電壓檢查
	public void addSIerrByTime(@Param("startTime")Date startTime);//dev ->電流    X
	public void addscollPIerrByTime(@Param("startTime")Date startTime);//PLC ->電流
	public void addHTCLogbyTime(@Param("startTime")Date startTime);//檢查溫度
	public void addwaringLogbyTime(@Param("startTime")Date startTime);
}
