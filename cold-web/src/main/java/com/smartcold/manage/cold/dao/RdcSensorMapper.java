package com.smartcold.manage.cold.dao;

import java.util.List;

import com.smartcold.manage.cold.entity.RdcSensor;

public interface RdcSensorMapper {
	
    int deleteByPrimaryKey(Integer rsid);

    int insert(RdcSensor record);

    int insertSelective(RdcSensor record);

    RdcSensor selectByPrimaryKey(Integer rsid);

    int updateByPrimaryKeySelective(RdcSensor record);

    int updateByPrimaryKey(RdcSensor record);
    
    List<RdcSensor> selectByRdcId(Integer rdcId);
    
    RdcSensor selectBySID(Integer sid);
    
}