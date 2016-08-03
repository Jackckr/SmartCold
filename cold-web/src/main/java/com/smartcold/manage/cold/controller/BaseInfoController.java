package com.smartcold.manage.cold.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.PackMapper;
import com.smartcold.manage.cold.dao.olddb.UsageMapper;
import com.smartcold.manage.cold.dao.olddb.WallMaterialMapper;
import com.smartcold.manage.cold.service.GoodsService;
import com.smartcold.manage.cold.service.StorageService;

@Controller
@RequestMapping(value = "/baseInfo")
public class BaseInfoController extends BaseController {
	
	@Autowired
	private GoodsService goodsService;
	
	@Autowired
	private PackMapper packDao;
	
	@Autowired
	private WallMaterialMapper wallMaterialDao;
	
	@Autowired
	private UsageMapper usageDao;
	
	@Autowired
	private StorageService storageService;
	
	@RequestMapping(value = "/findAllGoods", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllGoods(){
		return goodsService.getAllGoods();
	}
	
	@RequestMapping(value = "/findAllPack", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllPack(){
		return packDao.findAll();
	}
	
	@RequestMapping(value = "/findAllWallMaterial", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllWallMaterial(){
		return wallMaterialDao.findAll();
	}
	
	@RequestMapping(value = "/findAllUsage", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllUsage(){
		return usageDao.findAll();
	}
	
	@RequestMapping("/getKeyValueData")
	@ResponseBody
	public Object getKeyValueData(@RequestParam("type")Integer type, @RequestParam("oid")int oid,
			@RequestParam("key")String key,
			@RequestParam(value="nums",defaultValue="480")Integer nums){
		return storageService.findByNums(type, oid, key, nums);
	}
	
	@RequestMapping("/getKeyValueDataByTime")
	@ResponseBody
	public Object getKeyValueDataByTime(@RequestParam("type")Integer type, @RequestParam("oid")int oid,
			@RequestParam("key")String key,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime){
		return storageService.findByTime(type, oid, key, startTime, endTime);
	}
}
