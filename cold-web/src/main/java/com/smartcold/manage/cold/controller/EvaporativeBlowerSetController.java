package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.EvaporativeBlowerSetMapping;

@Controller
@RequestMapping(value = "/evaBlower")
public class EvaporativeBlowerSetController {

	@Autowired
	private EvaporativeBlowerSetMapping evaporativeBlowerSetDao;

	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {
		return evaporativeBlowerSetDao.findById(id);
	}

	@RequestMapping(value = "/findByGroupid", method = RequestMethod.GET)
	@ResponseBody
	public Object findByGroupid(@RequestParam int evaporativeId) {
		return evaporativeBlowerSetDao.findByGroupid(evaporativeId);
	}
}
