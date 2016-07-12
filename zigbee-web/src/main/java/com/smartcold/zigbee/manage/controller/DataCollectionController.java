package com.smartcold.zigbee.manage.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.zigbee.manage.dao.DataCollectionMapper;
import com.smartcold.zigbee.manage.dao.StorageDataCollectionMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.DataCollectionBatchEntity;
import com.smartcold.zigbee.manage.dto.DataCollectionBatchEntity.InfoEntity;
import com.smartcold.zigbee.manage.entity.DataCollectionEntity;
import com.smartcold.zigbee.manage.entity.StorageDataCollectionEntity;

@Controller
public class DataCollectionController extends BaseController {

	@Autowired
	private DataCollectionMapper dataDao;

	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;

	private Gson gson = new Gson();

	@RequestMapping(value = "/dataCollection_old", method = RequestMethod.POST)
	@ResponseBody
	public Object dataCollection(String data) {
		try {
			DataCollectionBatchEntity dataCollectionBatchEntity = gson.fromJson(data, DataCollectionBatchEntity.class);
			for (InfoEntity info : dataCollectionBatchEntity.getInfos()) {
				DataCollectionEntity dataCollectionEntity = new DataCollectionEntity(info.getDevID(),
						dataCollectionBatchEntity.getApID(), info.getTime(), info.getTemp());
				dataDao.add(dataCollectionEntity);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new BaseDto(500);
		}

		return new BaseDto(200);
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/dataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object storageDataCollection(String data) {
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
			return new BaseDto(500);
		}

		return new BaseDto(200);
	}
}
