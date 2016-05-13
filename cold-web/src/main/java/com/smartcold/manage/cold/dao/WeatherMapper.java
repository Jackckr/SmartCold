package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.Weather;

public interface WeatherMapper {
	
	public Weather findTempByCityID(int cityID);
}
