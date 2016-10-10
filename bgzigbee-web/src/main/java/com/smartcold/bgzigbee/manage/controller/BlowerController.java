package com.smartcold.bgzigbee.manage.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.smartcold.bgzigbee.manage.dao.BlowerSetMapper;
import com.smartcold.bgzigbee.manage.dao.SpiderItemConfigMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.BlowerSetEntity;
import com.smartcold.bgzigbee.manage.enums.SpiderItemType;

@Controller
@RequestMapping(value = "/blower")
public class BlowerController {

	private Gson gson = new Gson();

	@Autowired
	private BlowerSetMapper blowerDao;

	@Autowired
	private SpiderItemConfigMapper spiderItemConfigDao;

	@RequestMapping(value = "/getBlowerByColdStorageId")
	@ResponseBody
	public Object getBlowerByColdStorageId(int coldStorageId) {
		return blowerDao.findByStorageId(coldStorageId);
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

		blowerDao.updateMappingById(id, mapping);

		return new ResultDto(0, "修改成功");
	}

	@RequestMapping(value = "/findItem")
	@ResponseBody
	public Object findItem() {
		return spiderItemConfigDao.findItemByType(SpiderItemType.BLOWER.getType());
	}
	
	@RequestMapping(value = "/updateBlower", method = RequestMethod.POST)
	@ResponseBody
	public Object updateBlower(@RequestBody BlowerSetEntity entity) {
		blowerDao.updateBlower(entity);
		return new ResultDto(0, "修改成功");
	}
	
	@RequestMapping(value = "/insertBlower", method = RequestMethod.POST)
	@ResponseBody
	public Object insertBlower(@RequestBody BlowerSetEntity entity) {
		blowerDao.insertBlower(entity);
		return new ResultDto(0, "添加成功");
	}

	@RequestMapping(value = "/deleteBlower",  method = RequestMethod.DELETE)
	@ResponseBody
	public Object deleteBlower(int id) {
		blowerDao.deleteBlower(id);
		return new ResultDto(0, "删除成功");
	}
	
}
