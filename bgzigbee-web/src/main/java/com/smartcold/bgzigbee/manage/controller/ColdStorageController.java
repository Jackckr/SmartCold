package com.smartcold.bgzigbee.manage.controller;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.smartcold.bgzigbee.manage.dao.ColdStorageSetMapper;
import com.smartcold.bgzigbee.manage.dao.SpiderItemConfigMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.ColdStorageSetEntity;
import com.smartcold.bgzigbee.manage.enums.SpiderItemType;
import com.smartcold.bgzigbee.manage.service.RemoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping(value = "/coldStorage")
public class ColdStorageController {

	private Gson gson = new Gson();

	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;

	@Autowired
	private SpiderItemConfigMapper spiderItemConfigDao;
	
	@Autowired
	private RemoteService remoteService;

	@RequestMapping(value = "/getColdStorageByRdcId")
	@ResponseBody
	public Object getColdStorageByRdcId(int rdcId) {
		return coldStorageSetDao.findByRdcId(rdcId);
	}

	@RequestMapping(value = "/updateMapping")
	@ResponseBody
	public Object updateMapping(int coldStorageId, String mapping) {
		try {
			gson.fromJson(mapping, new TypeToken<Map<String, String>>() {
			}.getType());
		} catch (JsonParseException e) {
			return new ResultDto(-1, "参数不是合法的json map");
		}

		coldStorageSetDao.updateMappingById(coldStorageId, mapping);

		return new ResultDto(0, "修改成功");
	}

	@RequestMapping(value = "/findItem")
	@ResponseBody
	public Object findItem() {
		return spiderItemConfigDao.findItemByType(SpiderItemType.COLDSTORAGE.getType());
	}

	@RequestMapping(value = "/insertStorage", method = RequestMethod.POST)
	@ResponseBody
	public Object insertStorage(@RequestBody ColdStorageSetEntity coldStorageSetEntity) {
		coldStorageSetDao.insertColdStorage(coldStorageSetEntity);
		return new ResultDto(0, "添加成功");
	}

	@RequestMapping(value = "/deleteStorage", method = RequestMethod.DELETE)
	@ResponseBody
	public Object deleteStorage(int id) {
		coldStorageSetDao.deleteColdStorage(id);
		return new ResultDto(0, "删除成功");
	}

	@RequestMapping(value = "/updateStorage", method = RequestMethod.POST)
	@ResponseBody
	public Object updateStorage(@RequestBody ColdStorageSetEntity coldStorageSetEntity){
		if (coldStorageSetDao.update(coldStorageSetEntity)) {
			return new ResultDto(0, "修改成功");
		}
		return new ResultDto(-1, "修改失败");
	}

	
	@RequestMapping(value="/addStorageKey", method=RequestMethod.POST)
	@ResponseBody
	public Object addStorageKey(int type, String key, String desc, String unit){
		return remoteService.saveStorageKeys(type, key, desc, unit);
	}
	
	@RequestMapping(value="/delStorageKey", method=RequestMethod.DELETE)
	@ResponseBody
	public Object delStorageKey(@RequestParam("id")Integer id){
		return remoteService.delStorageKey(id);
	}
}
