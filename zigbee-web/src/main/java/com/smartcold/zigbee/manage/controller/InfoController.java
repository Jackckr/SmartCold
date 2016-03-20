package com.smartcold.zigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.service.SingleInfoService;

@Controller
@RequestMapping(value = "/singleInfo")
public class InfoController {

	@Autowired
	private SingleInfoService singleInfoService;

	@RequestMapping(value = "/findByKey", method = RequestMethod.GET)
	@ResponseBody
	public Object findByKey(String key) {
		return singleInfoService.getAllInfoByKey(key);
	}

	@RequestMapping(value = "/findBatchByKey", method = RequestMethod.GET)
	@ResponseBody
	public Object findBatchByKey(String key) {
		return singleInfoService.getBatchInfoByKey(key);
	}

}
