package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 09:57)
 * 
 * @Deprecated 将新方法添加到 NewDoorController 中
 */
@Controller
@RequestMapping(value = "/coldStorageDoor")
public class ColdStorageDoorController {

	
	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetDao;
	

	@RequestMapping(value = "/findByStorageId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByStorageId(@RequestParam int storageID) {
		return coldStorageDoorSetDao.findByStorageId(storageID);
	}

	/**
	 * 获得有效冷库门
	 * 
	 * @param recId
	 * @return
	 */
	@RequestMapping(value = "/getColdStorageDoor")
	@ResponseBody
	public Object getColdStorageDoor(Integer rdcId) {
		return coldStorageDoorSetDao.findValidByRdcId(rdcId);
	}
	
//	@Autowired
//	private ColdStorageDoorDao coldStorageDoorService;
//
//	@RequestMapping(value = "/findByStorageId", method = RequestMethod.GET)
//	@ResponseBody
//	public Object findByStorageId(@RequestParam int storageID) {
//		return coldStorageDoorService.findByStorageId(storageID);
//	}
//
//	@RequestMapping(value = "/findOpenTimeByStorageIdTime", method = RequestMethod.GET)
//	@ResponseBody
//	public Object findOpenTimeByStorageIdTime(int storageId,
//			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
//			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
//
//		return coldStorageDoorService.findOpenTimeByStorageId(storageId, startTime, endTime);
//	}
//
//	@RequestMapping(value = "/findOpenTimesByStorageIdTime", method = RequestMethod.GET)
//	@ResponseBody
//	public Object findOpenTimesByStorageIdTime(int storageId,
//			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
//			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
//
//		return coldStorageDoorService.findOpenTimesByStorageId(storageId, startTime, endTime);
//	}
}
