package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.WindScreenSetMapping;

@Controller
@RequestMapping(value = "/windScreen")
public class WindScreenSetController {

	@Autowired
	private WindScreenSetMapping windScreenSetDao;

	@RequestMapping(value = "/findById", method = RequestMethod.GET)
	@ResponseBody
	public Object findById(@RequestParam int id) {
		return windScreenSetDao.findById(id);
	}

	@RequestMapping(value = "/findByStorageId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByStorageId(@RequestParam int storageid) {
		return windScreenSetDao.findByStorageId(storageid);
	}
}
