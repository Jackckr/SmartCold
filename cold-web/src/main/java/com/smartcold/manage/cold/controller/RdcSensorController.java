package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.FileDataMapper;
import com.smartcold.manage.cold.dao.olddb.RdcSensorMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.FileDataEntity;
import com.smartcold.manage.cold.entity.olddb.RdcSensor;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.FtpService;
import com.smartcold.manage.cold.service.StorageService;

@Controller
@RequestMapping(value = "/rdcSensor")
public class RdcSensorController {

	@Autowired
	private RdcSensorMapper rdcSensorDao;

	@Autowired
	StorageService storageService;

	@Autowired
	ColdStorageSetMapper coldSttorageSetDao;

	@Autowired
	private FileDataMapper fileDataDao;

	// get background image url of rdc
	@RequestMapping(value = "/findRdcBkgImaUrl", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcBkgImaUrl(int rdcId) {
		// return compRdcDao.selectByRdcId(rdcId).getImgurl();
		List<FileDataEntity> arrangeFiles = fileDataDao.findByBelongIdAndCategory(rdcId,
				FileDataMapper.CATEGORY_ARRANGE_PIC);
		String imgUrl = null;
		if (!arrangeFiles.isEmpty()) {
			FileDataEntity arrangeFile = arrangeFiles.get(0);
			imgUrl = String.format("http://%s:%s/%s", FtpService.PUB_HOST, FtpService.READPORT,
					arrangeFile.getLocation());
		}
		return imgUrl;
	}
	/*
	 * // get list of sensor by the id of rdc
	 * 
	 * @SuppressWarnings({ "unchecked", "rawtypes" })
	 * 
	 * @RequestMapping(value = "/findSensorInfoByRdcId", method =
	 * RequestMethod.GET)
	 * 
	 * @ResponseBody public Object findSensorInfoByRdcId(int rdcId) {
	 * List<RdcSensor> rdcSensorList = new ArrayList(); List sensorInfoList =
	 * new ArrayList(); rdcSensorList = rdcSensorDao.selectByRdcId(rdcId);
	 * 
	 * for(RdcSensor rdcSensor : rdcSensorList){ Sensor sensor =
	 * sensorDao.selectByPrimaryKey(rdcSensor.getSid()); Map map = new
	 * HashMap(); map.put("rdcid", rdcId); map.put("sid", rdcSensor.getSid());
	 * map.put("wd", sensor.getTemp()); map.put("shd", sensor.getHumi());
	 * if(rdcSensor.getSx()!=null) map.put("div_x", rdcSensor.getSx()); else
	 * map.put("div_x", ""); if(rdcSensor.getSy()!=null) map.put("div_y",
	 * rdcSensor.getSy()); else map.put("div_y", ""); sensorInfoList.add(map); }
	 * return sensorInfoList; }
	 */

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value = "/getCurAllStorageTemp", method = RequestMethod.GET)
	@ResponseBody
	public Object getCurAllStorageTemp(String key, Integer rdcId) {

		List allInfoList = new ArrayList();

		List<RdcSensor> sensors = rdcSensorDao.selectByRdcId(rdcId);
		for (RdcSensor sensor : sensors) {
			List<StorageKeyValue> infos = storageService.findByNums(StorageType.STORAGE.getType(), sensor.getOid(),
					sensor.getKey(), 1);
			Map map = new HashMap();
			map.put("storageID", sensor.getOid());
			map.put("temperature", infos.size() > 0 ? Math.round(infos.get(0).getValue() * 10 / 10) : 0);
			map.put("div_x", sensor.getSx() == null ? "" : sensor.getSx());
			map.put("div_y", sensor.getSy() == null ? "" : sensor.getSy());
			allInfoList.add(map);
		}
		// for (ColdStorageSetEntity storageSet :
		// coldSttorageSetDao.findByRdcId(rdcId)) {
		// Map map = new HashMap();
		// map.put("storageID", storageSet.getColdStorageID());
		// List<StorageKeyValue> list = storageService.findByNums(1,
		// storageSet.getId(), "Temp", 1);
		// map.put("temperature", (float) (Math.round(list.get(0).getValue() *
		// 10)) / 10);
		// RdcSensor rdcSensor =
		// rdcSensorDao.findByOid(storageSet.getColdStorageID());
		// if (rdcSensor != null) {
		// if (rdcSensor.getSx() != null)
		// map.put("div_x", rdcSensor.getSx());
		// else
		// map.put("div_x", "");
		// if (rdcSensor.getSy() != null)
		// map.put("div_y", rdcSensor.getSy());
		// else
		// map.put("div_y", "");
		// }
		// allInfoList.add(map);
		// }
		return allInfoList;
	}

	// update div_x and div_y by id of sensor
	@RequestMapping(value = "/updateConfigByOid", method = RequestMethod.GET)
	@ResponseBody
	public Object updateConfigByOid(int oid, int div_x, int div_y) {
		RdcSensor rdcSensor = rdcSensorDao.findByOid(oid);
		rdcSensor.setSx(div_x);
		rdcSensor.setSy(div_y);
		return rdcSensorDao.updateByPrimaryKey(rdcSensor);
	}

}
