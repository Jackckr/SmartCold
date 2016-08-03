package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.Weather;

public interface WeatherMapper {
	
	public Weather findTempByCityID(int cityID);
}
