package com.smartcold.manage.cold.dao.newdb;

import com.smartcold.manage.cold.entity.newdb.Sensor;

public interface SensorMapper {
	
    int deleteByPrimaryKey(Integer sid);

    int insert(Sensor record);

    int insertSelective(Sensor record);

    Sensor selectByPrimaryKey(Integer sid);

    int updateByPrimaryKeySelective(Sensor record);

    int updateByPrimaryKey(Sensor record);
}