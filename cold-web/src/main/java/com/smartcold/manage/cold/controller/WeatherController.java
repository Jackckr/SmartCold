package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.WeatherMapper;
import com.smartcold.manage.cold.entity.newdb.Weather;

@Controller
@RequestMapping(value = "/city")
public class WeatherController extends BaseController {

	@Autowired
	private WeatherMapper weatherDao;

	@RequestMapping(value = "/findTempByCityID", method = RequestMethod.GET)
	@ResponseBody
	public Object findTempByCityID(int cityID) {
		Weather weather = new Weather();
		weather = weatherDao.findTempByCityID(cityID);
		if(weather==null)return 0;
		return (float)(Math.round(weather.getTemp1()*10))/10;
	}
}
