package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.WarningsInfo;

public interface WarningsInfoMapper {

	public List<WarningsInfo> findAllWarningInfo(int rdcId);

	public List<WarningsInfo> findLastNWarningInfo(@Param("rdcId") int rdcId, @Param("point") int point);
}
