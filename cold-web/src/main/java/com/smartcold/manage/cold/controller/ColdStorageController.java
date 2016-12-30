package com.smartcold.manage.cold.controller;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ColdStorageMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dto.NewStorageTempDto;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;

@Controller
@ResponseBody
@RequestMapping("/coldStorage")
public class ColdStorageController {

	@Autowired
	StorageService storageService;

	@Autowired
	ColdStorageSetMapper coldSttorageSetDao;

	@Autowired
	ColdStorageMapper coldStorageDao;

	@RequestMapping("/getTempByNums")
	public Object getTempByNums(Integer oid, String key,
			@RequestParam(value = "nums", defaultValue = "480") Integer nums) {
		List<StorageKeyValue> list = storageService.findByNums(StorageType.STORAGE, oid, key, nums);
		NewStorageTempDto storageTempDto = new NewStorageTempDto();
		storageTempDto.setList(list);
		ColdStorageSetEntity coldStorageSetEntity = coldSttorageSetDao.findLastNPoint(oid, 1).get(0);
		storageTempDto.setStartTemperature(coldStorageSetEntity.getStartTemperature());
		storageTempDto.setTempdiff(coldStorageSetEntity.getTempdiff());
		return storageTempDto;
	}

	@RequestMapping("/getTempByTime")
	public Object getTempByTime(Integer oid, String key, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		NewStorageTempDto storageTempDto = new NewStorageTempDto();
		List<StorageKeyValue> tempList = storageService.findByTime(StorageType.STORAGE.getType(), oid, key, startTime,endTime);
		storageTempDto.setList(tempList);
		ColdStorageSetEntity coldStorageSetEntity = coldSttorageSetDao.findLastNPoint(oid, 1).get(0);
		storageTempDto.setStartTemperature(coldStorageSetEntity.getStartTemperature());
		storageTempDto.setTempdiff(coldStorageSetEntity.getTempdiff());
		storageTempDto.setName(coldStorageSetEntity.getName());
		return storageTempDto;
	}
	@RequestMapping("/getPCTempByTime")
	public Object getPCTempByTime(Integer oid, String key, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		Map<String, List<StorageKeyValue>> tempMap = storageService.findTempByTime(StorageType.STORAGE.getType(), oid, key, startTime,endTime);
		NewStorageTempDto storageTempDto = new NewStorageTempDto();
		storageTempDto.setTempMap(tempMap);
		ColdStorageSetEntity coldStorageSetEntity = coldSttorageSetDao.findLastNPoint(oid, 1).get(0);
		storageTempDto.setStartTemperature(coldStorageSetEntity.getStartTemperature());
		storageTempDto.setTempdiff(coldStorageSetEntity.getTempdiff());
		storageTempDto.setName(coldStorageSetEntity.getName());
		return storageTempDto;
	}

	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	public Object findByUserId(@RequestParam int userId) {
		return storageService.findByUserId(userId);
	}

	@RequestMapping(value = "/findAnalysisByRdcidKeysDate", method = RequestMethod.GET)
	@ResponseBody
	public Object findAnalysisByRdcidKeyDate(int rdcid, String keys,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		return storageService.findAnalysisByRdcidKeyDate(rdcid, Arrays.asList(keys.split(",")), startTime, endTime);
	}
	@RequestMapping(value = "/findDoorSisByRdcidKeyDate", method = RequestMethod.GET)
	@ResponseBody
	public Object findDoorSisByRdcidKeyDate (int rdcid, String keys,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		return storageService.findDoorSisByRdcidKeyDate(rdcid, Arrays.asList(keys.split(",")), startTime, endTime);
	}
}
