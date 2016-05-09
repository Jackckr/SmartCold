package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.ColdStorageMapper;
import com.smartcold.manage.cold.dao.RdcSensorMapper;
import com.smartcold.manage.cold.entity.ColdStorageEntity;
import com.smartcold.manage.cold.entity.RdcSensor;
import com.smartcold.manage.cold.service.ColdStorageService;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

	@Autowired
	private RdcSensorMapper rdcSensorDao;

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

	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByUserId(@RequestParam int userId) {
		return coldStorageService.findByUserId(userId);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value = "/findAllNewColdStorage", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllNewColdStorage(int rdcId) {
		List<ColdStorageEntity> coldStoInfoList = new ArrayList();
		List allInfoList = new ArrayList();
		coldStoInfoList = coldStorageDao.findNewInsertColdStorages();

		for (ColdStorageEntity coldStorage : coldStoInfoList) {
			Map map = new HashMap();
			map.put("storageID", coldStorage.getStorageID());
			map.put("temperature", (float) (Math.round(coldStorage.getTemperature() * 100)) / 100);
			RdcSensor rdcSensor = rdcSensorDao.selectBySID(coldStorage.getStorageID());
			if (rdcSensor != null) {
				if (rdcSensor.getSx() != null)

					map.put("div_x", rdcSensor.getSx());
				else
					map.put("div_x", "");
				if (rdcSensor.getSy() != null)
					map.put("div_y", rdcSensor.getSy());
				else
					map.put("div_y", "");
			} else {
				RdcSensor newRdcSensor = new RdcSensor();
				newRdcSensor.setRdcid(rdcId);
				newRdcSensor.setSid(coldStorage.getStorageID());
				newRdcSensor.setSx(null);
				newRdcSensor.setSy(null);
				newRdcSensor.setColdstorageid(coldStorage.getStorageID());
				int insertState = rdcSensorDao.insert(newRdcSensor);
				System.out.println("insert RdcSensor data" + insertState);
				map.put("div_x", "");
				map.put("div_y", "");
			}
			allInfoList.add(map);
		}
		return allInfoList;
	}

	@RequestMapping(value = "/findInfoByIdTime")
	@ResponseBody
	public Object findInfoByIdTime(int storageId, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {

		return coldStorageDao.findPoitByTime(storageId, startTime, endTime);
	}
}
