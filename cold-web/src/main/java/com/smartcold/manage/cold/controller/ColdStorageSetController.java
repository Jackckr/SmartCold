package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.dao.ColdStorageSetMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-01 23:23)
 */
@Controller
@RequestMapping(value = "/coldStorageSet")
public class ColdStorageSetController {

	@Autowired
	private ColdStorageSetMapper coldStorageSetDao;

	@RequestMapping(value = "/findSetByStorageId", method = RequestMethod.GET)
	@ResponseBody
	public Object findSetByStorageId(@RequestParam int storageID, @RequestParam int npoint) {
		return coldStorageSetDao.findLastNPoint(storageID, npoint);
	}

	@RequestMapping(value = "/findStorageSetByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findStorageSetByRdcId(int rdcID) {
		return coldStorageSetDao.findByRdcId(rdcID);
	}
}
