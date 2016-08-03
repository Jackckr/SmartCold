package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.AirEnthalpyEntity;

public interface AirEnthalpyMapper {

	public AirEnthalpyEntity getEnthalpy(@Param("temperature") int temperature, @Param("humidity") float humidity);
}
