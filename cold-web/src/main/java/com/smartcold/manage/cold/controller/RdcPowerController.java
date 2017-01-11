package com.smartcold.manage.cold.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.RdcPowerConsumeMapper;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-04 11:50)
 */
@Controller
@RequestMapping(value = "/rdcPower")
public class RdcPowerController {

	@Autowired
	private RdcPowerConsumeMapper rdcPowerConsumeDao;

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByRdcId(@RequestParam int rdcID, @RequestParam int npoint) {
		return rdcPowerConsumeDao.findLastNPoint(rdcID, npoint);
	}

	@RequestMapping(value = "/findInfoByRdcIdTime", method = RequestMethod.GET)
	@ResponseBody
	public Object findInfoByRdcIdTime(int rdcId, @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {

		return rdcPowerConsumeDao.findInfoByRdcid(rdcId, startTime, endTime);
	}

}
