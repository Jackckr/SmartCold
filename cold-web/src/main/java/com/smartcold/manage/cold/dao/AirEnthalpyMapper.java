package com.smartcold.manage.cold.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.AirEnthalpyEntity;

public interface AirEnthalpyMapper {

	public AirEnthalpyEntity getEnthalpy(@Param("temperature") int temperature, @Param("humidity") float humidity);
}
