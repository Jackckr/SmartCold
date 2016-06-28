package com.smartcold.bgzigbee.manage.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.smartcold.bgzigbee.manage.dao.ColdStorageDoorSetMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;

@Controller
@RequestMapping(value = "/coldStorageDoor")
public class ColdStorageDoorController {

	private Gson gson = new Gson();

	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetDao;

	@RequestMapping(value = "/getcoldStorageDoorByStorageId")
	@ResponseBody
	public Object getcoldStorageDoorByStorageId(int coldStorageId) {
		return coldStorageDoorSetDao.findDoorByStorageId(coldStorageId);
	}

	@RequestMapping(value = "/updateMapping")
	@ResponseBody
	public Object updateMapping(int id, String mapping) {
		try {
			gson.fromJson(mapping, new TypeToken<Map<String, String>>() {
			}.getType());
		} catch (JsonParseException e) {
			return new ResultDto(-1, "参数不是合法的json map");
		}

		coldStorageDoorSetDao.updateMappingById(id, mapping);

		return new ResultDto(0, "修改成功");
	}
}
