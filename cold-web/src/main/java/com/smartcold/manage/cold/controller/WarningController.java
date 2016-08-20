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

import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsSetMapper;
import com.smartcold.manage.cold.entity.newdb.WarningsInfo;

@Controller
@RequestMapping(value = "/warn")
public class WarningController extends BaseController {

	@Autowired
	private WarningsInfoMapper warningsInfoDao;
	
	@Autowired
	private WarningsSetMapper warningsSetDao;
	
	@RequestMapping(value = "/findAllWarningsInfoByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findAllWarningsInfo(int rdcId) {
		List<WarningsInfo> warningsInfoList = warningsInfoDao.findAllWarningInfo(rdcId);
		return warningsInfoList;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/findLastNWarningsInfoByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findLastNWarningsInfoByRdcId(int rdcId, int point) {
		List<WarningsInfo> warningsInfoList = warningsInfoDao.findLastNWarningInfo(rdcId, point);
		List allInfoList = new ArrayList();
		for(WarningsInfo warningInfo : warningsInfoList){
			String warningName = warningsSetDao.findWarningSetById(warningInfo.getObjId()).getName();
//ce shi			String warningName = warningsSetDao.findWarningSetById(1).getName();
			Map map = new HashMap();
			map.put("addtime", warningInfo.getAddtime());
			map.put("warningName", warningName);
			map.put("level", warningInfo.getLevel());
			map.put("id", warningInfo.getId());
			allInfoList.add(map);
			}
		return allInfoList;
	}
}
