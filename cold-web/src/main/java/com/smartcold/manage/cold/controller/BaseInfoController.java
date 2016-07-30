package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.PackMapper;
import com.smartcold.manage.cold.dao.UsageMapper;
import com.smartcold.manage.cold.dao.WallMaterialMapper;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.GoodsService;

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
	
	@RequestMapping("/findAllStorageType")
	@ResponseBody
	public Object findAllStorageType(){
		List<Map<String, String>> list = new ArrayList<Map<String,String>>();
		for(StorageType type:StorageType.values()){
			Map<String, String> map = new HashMap<String, String>();
			map.put("type", String.valueOf(type.getType()));
			map.put("desc", type.getDesc());
			list.add(map);
		}
		return list;
	}
}
