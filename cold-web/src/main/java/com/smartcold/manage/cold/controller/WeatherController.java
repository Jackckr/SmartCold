package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.WeatherMapper;
import com.smartcold.manage.cold.entity.Weather;

@Controller
@RequestMapping(value = "/city")
public class WeatherController extends BaseController {

	@Autowired
	private WeatherMapper weatherDao;

	@RequestMapping(value = "/findTempByCityID", method = RequestMethod.GET)
	@ResponseBody
	public Object findTempByCityID(int cityID) {
		Weather weather = new Weather();
		System.out.println("cityId: "+cityID);
		weather = weatherDao.findTempByCityID(cityID);
		System.out.println(weather.getTemp1());
		return (float)(Math.round(weather.getTemp1()*100))/100;
	}
}
