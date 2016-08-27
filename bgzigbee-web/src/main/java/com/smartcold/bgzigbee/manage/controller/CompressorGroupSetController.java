package com.smartcold.bgzigbee.manage.controller;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.smartcold.bgzigbee.manage.dao.CompressorGroupSetMapper;
import com.smartcold.bgzigbee.manage.dao.CompressorSetMapper;
import com.smartcold.bgzigbee.manage.dao.SpiderItemConfigMapper;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.CompressorGroupSetEntity;
import com.smartcold.bgzigbee.manage.entity.CompressorSetEntity;
import com.smartcold.bgzigbee.manage.enums.SpiderItemType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping(value = "/compressorGroup")
public class CompressorGroupSetController {

	private Gson gson = new Gson();

	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;

	@Autowired
	private SpiderItemConfigMapper spiderItemConfigDao;

	@Autowired
	private CompressorSetMapper compressorSetDao;

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

	@RequestMapping(value = "/deleteCompressGroup", method = RequestMethod.DELETE)
	@ResponseBody
	public Object deleteCompressGroup(int id) {
		compressorGroupSetDao.deleteCompressorGroup(id);

		return new ResultDto(0, "删除成功");
	}

	@RequestMapping("/findCompressorByGid")
	@ResponseBody
	public Object findCompressorByGid(int groupId){
		return compressorSetDao.findCompressorByGroupid(groupId);
	}

	@RequestMapping(value="/saveCompressor", method = RequestMethod.POST)
    @ResponseBody
    public Object saveCompressor(@RequestBody CompressorSetEntity entity){
		if (compressorSetDao.insert(entity)) {
			return new ResultDto(0, "保存成功");
		}
        return new ResultDto(-1, "失败");
    }

    @RequestMapping(value = "/updateCompressGroup", method = RequestMethod.POST)
	@ResponseBody
	public Object updateCompressGroup(@RequestBody CompressorGroupSetEntity entity){
		if (compressorGroupSetDao.updateById(entity)) {
			return new ResultDto(0, "更新成功");
		}
		return new ResultDto(-1, "更新失败");
	}

	@RequestMapping(value = "/deleteCompressor", method = RequestMethod.DELETE)
	@ResponseBody
	public Object deleteCompressor(int id){
		if (compressorSetDao.deleteById(id)) {
			return new ResultDto(0, "删除成功");
		}
		return new ResultDto(-1, "删除失败");
	}

	@RequestMapping(value = "/updateCompressor", method = RequestMethod.POST)
	@ResponseBody
	public Object updateCompressor(@RequestBody CompressorSetEntity entity) {
		if (compressorSetDao.updateById(entity)) {
			return new ResultDto(0, "更新成功");
		}
		return new ResultDto(-1, "失败");
	}
}
