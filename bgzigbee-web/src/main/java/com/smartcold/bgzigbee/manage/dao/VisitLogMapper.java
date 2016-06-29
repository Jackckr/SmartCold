package com.smartcold.bgzigbee.manage.dao;

import java.util.Date;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.VisitLogEntity;

public interface VisitLogMapper {

	public VisitLogEntity findLastLog();

	public void insertNewLog(@Param("visitpeoples") int visitpeoples, @Param("addtime") Date addtime);
}
