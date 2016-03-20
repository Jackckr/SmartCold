package com.smartcold.zigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.smartcold.zigbee.manage.dao.DataCollectionMapper;
import com.smartcold.zigbee.manage.entity.DataCollectionEntity;

@Controller
public class DataCollectionController extends BaseController {

	@Autowired
	private DataCollectionMapper dataDao;

	@RequestMapping(value = "/dataCollection", method = RequestMethod.POST)
	@ResponseBody
	public void dataCollection(@RequestBody String data) {
		Gson gson = new Gson();
		DataCollectionEntity dataCollectionEntity = gson.fromJson(data, DataCollectionEntity.class);
		dataDao.add(dataCollectionEntity);
	}
}
