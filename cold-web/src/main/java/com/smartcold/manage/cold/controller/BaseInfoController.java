package com.smartcold.manage.cold.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.PackMapper;
import com.smartcold.manage.cold.dao.newdb.TaskMapper;
import com.smartcold.manage.cold.dao.newdb.UsageMapper;
import com.smartcold.manage.cold.dao.newdb.WallMaterialMapper;
import com.smartcold.manage.cold.dao.olddb.TempSetMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.service.GoodsService;
import com.smartcold.manage.cold.service.StorageService;

/**
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping(value = "/baseInfo")
public class BaseInfoController extends BaseController {
	@Autowired
	private PackMapper packDao;
	@Autowired
	private TaskMapper taskDao;
	@Autowired
	private UsageMapper usageDao;
	@Autowired
	private TempSetMapper tempSetMapper;
	@Autowired
	private GoodsService goodsService;
	@Autowired
	private StorageService storageService;
	@Autowired
	private WallMaterialMapper wallMaterialDao;

	@RequestMapping(value = "/findAllGoods", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllGoods() {
		return goodsService.getAllGoods();
	}

	@RequestMapping(value = "/findAllPack", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllPack() {
		return packDao.findAll();
	}

	@RequestMapping(value = "/findAllWallMaterial", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllWallMaterial() {
		return wallMaterialDao.findAll();
	}

	@RequestMapping(value = "/findAllUsage", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllUsage() {
		return usageDao.findAll();
	}

	@RequestMapping("/getKeyValueData")
	@ResponseBody
	public Object getKeyValueData(@RequestParam("type") Integer type,
			@RequestParam("oid") int oid, @RequestParam("key") String key,
			@RequestParam(value = "nums", defaultValue = "480") Integer nums) {
		return storageService.findByNums(type, oid, key, nums);
	}


	
	@RequestMapping("/getKeyValueDataByTime")
	@ResponseBody
	public Object getKeyValueDataByTime(@RequestParam("type") Integer type,
			@RequestParam("oid") int oid, @RequestParam("key") String key,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
		return storageService.findByTime(type, oid, key, startTime, endTime,
				"DESC");
	}

	@RequestMapping("/getKeyValuesByTime")
	@ResponseBody
	public Object getKeyValuesByTime(@RequestParam("type") Integer type,
			@RequestParam("oids") 	int [] oids,@RequestParam("key") String key,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime,
			@RequestParam(value = "nums", defaultValue = "1") Integer nums) {
		
		HashMap<Integer, List<StorageKeyValue>> result = new HashMap<Integer,List<StorageKeyValue>>();
		for (int oid : oids) {
			result.put(oid,  storageService.findByTime(type, oid, key, startTime, endTime,nums));
		}
		return result;
		
	}

}