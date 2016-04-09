package com.smartcold.zigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.smartcold.zigbee.manage.dao.DataCollectionMapper;
import com.smartcold.zigbee.manage.dto.BaseDto;
import com.smartcold.zigbee.manage.dto.DataCollectionBatchEntity;
import com.smartcold.zigbee.manage.dto.DataCollectionBatchEntity.InfoEntity;
import com.smartcold.zigbee.manage.entity.DataCollectionEntity;

@Controller
public class DataCollectionController extends BaseController {

	@Autowired
	private DataCollectionMapper dataDao;

	@RequestMapping(value = "/dataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object dataCollection(String data) {
		Gson gson = new Gson();

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
}
