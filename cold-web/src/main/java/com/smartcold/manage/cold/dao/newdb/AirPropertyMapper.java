package com.smartcold.manage.cold.dao.newdb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.AirPropertyEntity;

public interface AirPropertyMapper {

	public AirPropertyEntity getAirProperty(@Param("temperature") int temperature);
}
