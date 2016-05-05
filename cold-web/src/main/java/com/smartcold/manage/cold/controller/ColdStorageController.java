package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.ColdStorageMapper;
import com.smartcold.manage.cold.service.ColdStorageService;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Description: ColdStorageController Author: qiunian.sun Update:
 * qiunian.sun(2016-03-15 23:38)
 */
@Controller
@RequestMapping(value = "/coldStorage")
public class ColdStorageController {

	@Autowired
	private ColdStorageMapper coldStorageDao;

	@Autowired
	private ColdStorageService coldStorageService;

	@RequestMapping(value = "/findColdStorageById", method = RequestMethod.GET)
	@ResponseBody
	public Object findColdStorageById(@RequestParam int storageID, @RequestParam int npoint) {
		return coldStorageDao.findLastNPoint(storageID, npoint);
	}

	@RequestMapping(value = "/getTemperInfoById", method = RequestMethod.GET)
	@ResponseBody
	public Object getTemperInfoById(@RequestParam int storageID, @RequestParam int npoint) {
		return coldStorageService.getTemperInfoById(storageID, npoint);
	}

	@RequestMapping(value = "/findInfoByIdTime")
	@ResponseBody
	public Object findInfoByIdTime(int storageId, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {

		return coldStorageDao.findPoitByTime(storageId, startTime, endTime);
	}

	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByUserId(@RequestParam int userId) {
		return coldStorageService.findByUserId(userId);
	}
}
