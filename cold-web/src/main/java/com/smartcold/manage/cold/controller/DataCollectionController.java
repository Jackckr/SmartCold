package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.dao.newdb.StorageDataCollectionMapper;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;

@Controller
public class DataCollectionController extends BaseController {

	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;

	private Gson gson = new Gson();

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/dataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object storageDataCollection(@RequestBody String data) {
		try {
			Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {
			}.getType());
			String apID = dataCollectionBatchEntity.get("apID").toString();
			ArrayList<StorageDataCollectionEntity> arrayList = new ArrayList<StorageDataCollectionEntity>();
			for (Map<String, String> info : (List<Map<String, String>>) dataCollectionBatchEntity.get("infos")) {
				Date time = new Date(Integer.parseInt(info.get("time")) * 1000);
				String deviceId = info.remove("devID").toString();
				for (Entry<String, String> item : info.entrySet()) {
					arrayList
							.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
				}
			}
			storageDataCollectionDao.batchInsert(arrayList);
		} catch (Exception e) {
			e.printStackTrace();
			return new DataResultDto(500);
		}

		return new DataResultDto(200);
	}

	@RequestMapping(value = "/findLastNDataByApid", method = RequestMethod.GET)
	@ResponseBody
	public Object findLastNDataByApid(String apid, String deviceid, String key, int n) {
		return storageDataCollectionDao.findLastNPoint(apid, deviceid, key, n);
	}

	@RequestMapping(value = "/findByTime", method = RequestMethod.GET)
	@ResponseBody
	public Object findByTime(String apid, String deviceid, String key,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {

		return storageDataCollectionDao.findByTime(apid, deviceid, key, startTime, endTime);
	}

}
