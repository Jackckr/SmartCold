package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.service.MsgService;
import com.smartcold.manage.cold.service.RdcService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ResponseData;

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
	@Autowired
	private StorageService storageService;
	@Autowired
	private MsgService msgService;
	@Autowired
	private DeviceObjectMappingMapper deviceMapper;
	
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
	public Object searchRdc(String filter) {
		// HashMap<String, List<Rdc>> result = new HashMap<String, List<Rdc>>();
		// result.put("results", rdcMapper.searchRdc("%" + filter + "%"));
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
	
	
	//====================================================以下提供测试API====================================================
	@RequestMapping(value = "/checkAPStatus")
	@ResponseBody
	public ResponseData<String> checkAPStatus() {
		this.msgService.checkAPStatus();
		return ResponseData.newSuccess("检查AP状态成功！");
	}
	@RequestMapping(value = "/checkDataStatus")
	@ResponseBody
	public ResponseData<String> checkDataStatus() {
		this.msgService.checkData();
		return ResponseData.newSuccess("检查数据状态成功！");
	}
	
	@RequestMapping(value = "/reckonQuantity")
	@ResponseBody
	public ResponseData<String> reckonQuantity() {
		
		return ResponseData.newSuccess("检查数据状态成功！");
	}
	
}
