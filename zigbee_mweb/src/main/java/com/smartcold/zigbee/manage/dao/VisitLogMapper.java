package com.smartcold.zigbee.manage.dao;

import java.util.Date;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.VisitLogEntity;

public interface VisitLogMapper {

	public VisitLogEntity findLastLog();

	public void insertNewLog(@Param("visitpeoples") int visitpeoples, @Param("addtime") Date addtime);
}
