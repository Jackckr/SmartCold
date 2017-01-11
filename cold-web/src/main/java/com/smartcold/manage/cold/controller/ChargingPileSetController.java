package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ChargingPileSetMapping;

@Controller
@RequestMapping(value = "/chargingPile")
public class ChargingPileSetController {

	@Autowired
	private ChargingPileSetMapping chargingPileSetDao;

	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {
		return chargingPileSetDao.findById(id);
	}

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByRdcId(@RequestParam int rdcId) {
		return chargingPileSetDao.findByRdcId(rdcId);
	}
}
