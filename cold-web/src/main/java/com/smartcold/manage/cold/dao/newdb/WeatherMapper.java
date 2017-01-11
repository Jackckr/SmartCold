package com.smartcold.manage.cold.dao.newdb;

import com.smartcold.manage.cold.entity.newdb.Weather;

public interface WeatherMapper {
	
	public Weather findTempByCityID(int cityID);
}
