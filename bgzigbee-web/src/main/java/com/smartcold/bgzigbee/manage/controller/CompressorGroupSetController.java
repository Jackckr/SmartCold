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
import com.smartcold.bgzigbee.manage.dao.CompressorGroupSetMapper;
import com.smartcold.bgzigbee.manage.dao.SpiderItemConfigMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.CompressorGroupSetEntity;
import com.smartcold.bgzigbee.manage.enums.SpiderItemType;

@Controller
@RequestMapping(value = "/compressorGroup")
public class CompressorGroupSetController {

	private Gson gson = new Gson();

	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;

	@Autowired
	private SpiderItemConfigMapper spiderItemConfigDao;

	@RequestMapping(value = "/getCompressGroupByRdcId")
	@ResponseBody
	public Object getcoldStorageByRdcId(int rdcId) {
		return compressorGroupSetDao.findByRdcId(rdcId);
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

		compressorGroupSetDao.updateMappingById(id, mapping);

		return new ResultDto(0, "修改成功");
	}

	@RequestMapping(value = "/findItem")
	@ResponseBody
	public Object findItem() {
		return spiderItemConfigDao.findItemByType(SpiderItemType.COMPRESSOR.getType());
	}

	@RequestMapping(value = "/insertCompressGroup", method = RequestMethod.POST)
	@ResponseBody
	public Object insertCompressGroup(@RequestBody CompressorGroupSetEntity entity) {
		compressorGroupSetDao.insertCompressorGroup(entity);

		return new ResultDto(0, "添加成功");
	}

	@RequestMapping(value = "/deleteCompressGroup", method = RequestMethod.POST)
	@ResponseBody
	public Object deleteCompressGroup(int id) {
		compressorGroupSetDao.deleteCompressorGroup(id);

		return new ResultDto(0, "删除成功");
	}
}
