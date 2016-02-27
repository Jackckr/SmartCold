package com.smartcold.zigbee.manage.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.ScinfoMapper;
import com.smartcold.zigbee.manage.service.ScDeviceService;

@Controller
@RequestMapping(value = "/scinfo")
public class ScinfoController {

	@Autowired
	private ScinfoMapper scinfoDao;
	
	@Autowired
	private ScDeviceService scService;

	@RequestMapping(value = "/findByKey", method = RequestMethod.GET)
	@ResponseBody
	public Object findByKey(String key) {
		return scinfoDao.findInfoByKey(key);
	}

	@RequestMapping(value = "/findALLInfoByKey", method = RequestMethod.GET)
	@ResponseBody
	public Object findALLInfoByKey(String key) {
		Map<String, Object> allInfos = new HashMap<String, Object>();
		allInfos.put("temperature", scinfoDao.findInfoDeviceByKey(key));
		allInfos.put("ananysis", scService.findScDeviceByKey(key));
		return allInfos;
	}

}
