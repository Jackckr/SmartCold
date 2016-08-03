package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import com.smartcold.manage.cold.entity.olddb.WarningsInfo;

public interface WarningsInfoMapper {
	
	public List<WarningsInfo> findAllWarningInfo(int rdcId);
}
