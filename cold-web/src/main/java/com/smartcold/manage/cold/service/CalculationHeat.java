package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.entity.olddb.CalculationHeatEntity;

public interface CalculationHeat {

	public float calculateQ(CalculationHeatEntity calculationEntity);

	public float calculateQ1(CalculationHeatEntity calculationEntity);

	public float calculateQ2(CalculationHeatEntity calculationEntity);

	public float calculateQ3(CalculationHeatEntity calculationEntity);

	public float calculateQ4(CalculationHeatEntity calculationEntity);

	public float calculateWall(float s, float k, float toutside, float tinside, float a);

	public float calculateEntropy(int typeId, String goodsName, float fromTemperature, float toTemperature);
}
