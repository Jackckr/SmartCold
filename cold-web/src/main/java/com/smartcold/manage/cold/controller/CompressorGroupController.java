package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.CompressorGroupMapper;
import com.smartcold.manage.cold.dao.CompressorGroupSetMapper;
import com.smartcold.manage.cold.service.CompressorGroupService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 15:05)
 */
@Controller
@RequestMapping(value = "/compressorGroup")
public class CompressorGroupController {

	@Autowired
	private CompressorGroupMapper compressorGroupDao;

	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;

	@Autowired
	private CompressorGroupService compressorGroupService;

	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByUserId(@RequestParam int userId) {
		return compressorGroupService.findByUserId(userId);
	}

	@RequestMapping(value = "/findByGroupId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByGroupId(@RequestParam int compressorID, @RequestParam int npoint) {
		System.out.println("compressorID: " + compressorID);
		return compressorGroupDao.findLastNPoint(compressorID, npoint);
	}

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByGroupId(@RequestParam int rdcId) {
		return compressorGroupSetDao.findLastNPoint(rdcId);
	}
}
