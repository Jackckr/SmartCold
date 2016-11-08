package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.RdcreportsisEntity;


public interface RdcreportsisMapper {
  
  public void addRdcreportsis(RdcreportsisEntity rdcreportsis) ;
  
  public void updateRdcreportsis(RdcreportsisEntity rdcreportsis) ;
  
  public List<RdcreportsisEntity> getMothReportsisByrdcId(@Param("rdcId")Integer rdcId,@Param("startTime")Object startTime ,@Param("endTime")Object endTime);
   
}