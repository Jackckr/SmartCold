package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.service.RdcService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/rdc")
public class RdcController {

	@Autowired
	private RdcMapper rdcMapper;

	@Autowired
	private RdcService rdcService;

	
	@RequestMapping(value = "/findRdcList", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcList() {
		return rdcMapper.findRdcList();
	}

	@RequestMapping(value = "/findRDCByRDCId", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCByRDCId(@RequestParam int rdcID) {
		return rdcMapper.findRDCByRDCId(rdcID);
	}

	@RequestMapping(value = "/searchRdc", method = RequestMethod.GET)
	@ResponseBody
	public Object searchRdc(String filter,Integer type) {
		if(type!=null&&type==1){
			return rdcMapper.searchRdcByfilter("%" + filter + "%");
		}
		return rdcMapper.searchRdc("%" + filter + "%");
	}

	@RequestMapping(value = "/findRDCsByUserid", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCsByUserid(@RequestParam int userid) {
		return rdcService.findRdcsByUserId(userid);
	}

	@RequestMapping(value = "/findRDCByUserid", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCByUserid(@RequestParam int userid) {
		return rdcService.findRdcByUserid(userid);
	}
	
	
	
}
