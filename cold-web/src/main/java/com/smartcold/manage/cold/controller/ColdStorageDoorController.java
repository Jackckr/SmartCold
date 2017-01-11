package com.smartcold.manage.cold.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.service.ColdStorageDoorService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 09:57)
 * 
 * @Deprecated 将新方法添加到 NewDoorController 中
 */
@Deprecated
@Controller
@RequestMapping(value = "/coldStorageDoor")
public class ColdStorageDoorController {

	@Autowired
	private ColdStorageDoorService coldStorageDoorService;

	@RequestMapping(value = "/findByStorageId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByStorageId(@RequestParam int storageID) {
		return coldStorageDoorService.findByStorageId(storageID);
	}

	@RequestMapping(value = "/findOpenTimeByStorageIdTime", method = RequestMethod.GET)
	@ResponseBody
	public Object findOpenTimeByStorageIdTime(int storageId,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {

		return coldStorageDoorService.findOpenTimeByStorageId(storageId, startTime, endTime);
	}

	@RequestMapping(value = "/findOpenTimesByStorageIdTime", method = RequestMethod.GET)
	@ResponseBody
	public Object findOpenTimesByStorageIdTime(int storageId,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {

		return coldStorageDoorService.findOpenTimesByStorageId(storageId, startTime, endTime);
	}
}
