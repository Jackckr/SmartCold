package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.EvaporativeSetMapping;
import com.smartcold.manage.cold.service.EvaporativeSetService;

@Controller
@RequestMapping(value = "/evaporative")
public class EvaporativeSetController {

	@Autowired
	private EvaporativeSetMapping evaporativeSetDao;

	@Autowired
	private EvaporativeSetService evaporativeSetService;

	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {
		return evaporativeSetDao.findByid(id);
	}

//	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
//	@ResponseBody
//	public Object findByRdcId(@RequestParam int rdcId) {
//		return evaporativeSetDao.findByRdcId(rdcId);
//	}
//
//	@RequestMapping(value = "/findInfoByRdcId", method = RequestMethod.GET)
//	@ResponseBody
//	public Object findInfoByRdcId(@RequestParam int rdcId) {
//
//		return evaporativeSetService.getInfoByRdcId(rdcId);
//	}

	@RequestMapping(value = "/findInfoByGroupId", method = RequestMethod.GET)
	@ResponseBody
	public Object findInfoByGruopId(@RequestParam int groupId) {

		return evaporativeSetService.getInfoByGroupId(groupId);
	}
}
