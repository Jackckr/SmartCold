package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.Sensor;

public interface SensorMapper {
	
    int deleteByPrimaryKey(Integer sid);

    int insert(Sensor record);

    int insertSelective(Sensor record);

    Sensor selectByPrimaryKey(Integer sid);

    int updateByPrimaryKeySelective(Sensor record);

    int updateByPrimaryKey(Sensor record);
}