package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import com.smartcold.manage.cold.entity.olddb.RdcSensor;

public interface RdcSensorMapper {
	
    int deleteByPrimaryKey(Integer rsid);

    int insert(RdcSensor record);

    int insertSelective(RdcSensor record);

    RdcSensor selectByPrimaryKey(Integer rsid);

    int updateByPrimaryKeySelective(RdcSensor record);

    int updateByPrimaryKey(RdcSensor record);
    
    List<RdcSensor> selectByRdcId(Integer rdcId);
    
    RdcSensor selectBySID(Integer sid);
    
    RdcSensor findByOid(Integer oid);
    
}