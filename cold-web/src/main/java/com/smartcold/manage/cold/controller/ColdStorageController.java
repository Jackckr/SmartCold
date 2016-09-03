package com.smartcold.manage.cold.controller;

import java.util.Date;
import java.util.List;

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
	public Object getTempByTime(Integer oid, String key,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		List<StorageKeyValue> list = storageService.findByTime(StorageType.STORAGE.getType(), oid, key, startTime,
				endTime);
		NewStorageTempDto storageTempDto = new NewStorageTempDto();
		storageTempDto.setList(list);
		ColdStorageSetEntity coldStorageSetEntity = coldSttorageSetDao.findLastNPoint(oid, 1).get(0);
		storageTempDto.setStartTemperature(coldStorageSetEntity.getStartTemperature());
		storageTempDto.setTempdiff(coldStorageSetEntity.getTempdiff());
		return storageTempDto;
	}

	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	public Object findByUserId(@RequestParam int userId) {
		return storageService.findByUserId(userId);
	}

	@RequestMapping(value = "/findAnalysisByRdcidKeyDate", method = RequestMethod.GET)
	@ResponseBody
	public Object findAnalysisByRdcidKeyDate(int rdcid, String key, Date startTime, Date endTime) {
		return storageService.findAnalysisByRdcidKeyDate(rdcid, key, startTime, endTime);
	}

	// 废弃不用
	/*
	 * @SuppressWarnings({ "rawtypes", "unchecked" })
	 * 
	 * @RequestMapping(value = "/findAllNewColdStorage", method =
	 * RequestMethod.GET)
	 * 
	 * @ResponseBody public Object findAllNewColdStorage(int rdcId) {
	 * List<ColdStorageEntity> coldStoInfoList = new ArrayList(); List
	 * allInfoList = new ArrayList(); coldStoInfoList =
	 * coldStorageDao.findNewInsertColdStorages();
	 * 
	 * for (ColdStorageEntity coldStorage : coldStoInfoList) { Map map = new
	 * HashMap(); map.put("storageID", coldStorage.getStorageID());
	 * map.put("temperature", (float) (Math.round(coldStorage.getTemperature() *
	 * 100)) / 100); RdcSensor rdcSensor =
	 * rdcSensorDao.selectBySID(coldStorage.getStorageID()); if (rdcSensor !=
	 * null) { if (rdcSensor.getSx() != null)
	 * 
	 * map.put("div_x", rdcSensor.getSx()); else map.put("div_x", ""); if
	 * (rdcSensor.getSy() != null) map.put("div_y", rdcSensor.getSy()); else
	 * map.put("div_y", ""); } else { RdcSensor newRdcSensor = new RdcSensor();
	 * newRdcSensor.setRdcid(rdcId);
	 * newRdcSensor.setSid(coldStorage.getStorageID());
	 * newRdcSensor.setSx(null); newRdcSensor.setSy(null);
	 * newRdcSensor.setColdstorageid(coldStorage.getStorageID()); int
	 * insertState = rdcSensorDao.insert(newRdcSensor); System.out.println(
	 * "insert RdcSensor data" + insertState); map.put("div_x", "");
	 * map.put("div_y", ""); } allInfoList.add(map); } return allInfoList; }
	 */
}
