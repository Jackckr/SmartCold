package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.EvaporativeWaterSetMapping;

@Controller
@RequestMapping(value = "/evaWater")
public class EvaporativeWaterSetController {

	@Autowired
	private EvaporativeWaterSetMapping evaporativeWaterSetDao;

	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {
		return evaporativeWaterSetDao.findById(id);
	}

	@RequestMapping(value = "/findByGroupid", method = RequestMethod.GET)
	@ResponseBody
	public Object findByGroupid(@RequestParam int evaporativeId) {
		return evaporativeWaterSetDao.findByGroupid(evaporativeId);
	}
}
