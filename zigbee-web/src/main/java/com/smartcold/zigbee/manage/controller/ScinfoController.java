package com.smartcold.zigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.ScinfoMapper;

@Controller
@RequestMapping(value = "/scinfo")
public class ScinfoController {

	@Autowired
	private ScinfoMapper scinfoDao;

	@RequestMapping(value = "/findByKey", method = RequestMethod.GET)
	@ResponseBody
	public Object findByKey(String key) {
		return scinfoDao.findInfoByKey(key);
	}

	@RequestMapping(value = "/findALLInfoByKey", method = RequestMethod.GET)
	@ResponseBody
	public Object findALLInfoByKey(String key) {
		return scinfoDao.findInfoDeviceByKey(key);
	}

}
