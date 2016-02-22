package com.smartcold.manage.cold.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.AirPropertyEntity;

public interface AirPropertyMapper {

	public AirPropertyEntity getAirProperty(@Param("temperature") int temperature);
}
