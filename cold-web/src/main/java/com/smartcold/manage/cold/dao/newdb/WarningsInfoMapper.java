package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.WarningsInfo;

public interface WarningsInfoMapper {
	
	public List<WarningsInfo> findAllWarningInfo(int rdcId);
}
