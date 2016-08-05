package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.AirPropertyEntity;

public interface AirPropertyMapper {

	public AirPropertyEntity getAirProperty(@Param("temperature") int temperature);
}
