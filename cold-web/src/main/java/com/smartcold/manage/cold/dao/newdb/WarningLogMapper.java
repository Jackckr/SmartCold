package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.WarningsLog;


public interface WarningLogMapper {
	/**
	 * 
	 * @param warningsInfoList
	 */
	public void addWarningLog(List<WarningsLog> warningsLogList);
	
	public List<WarningsLog> findAllWarningLog(int rdcId);
}
