package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.CompressorGroupMapper;
import com.smartcold.manage.cold.dao.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dao.StorageKeyValueMapper;
import com.smartcold.manage.cold.entity.StorageKeyValue;
import com.smartcold.manage.cold.service.CompressorGroupService;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 15:05)
 */
@Controller
@ResponseBody
@RequestMapping(value = "/compressorGroup")
public class CompressorGroupController {


	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;

	@Autowired
	private CompressorGroupService compressorGroupService;

	@RequestMapping(value = "/findByUserId", method = RequestMethod.GET)
	public Object findByUserId(@RequestParam int userId) {
		return compressorGroupService.findByUserId(userId);
	}

	@RequestMapping(value = "/findPowerByNums", method = RequestMethod.GET)
	public Object findPowerByNums(@RequestParam int compressorID, 
			@RequestParam(value="nums",defaultValue="480")Integer nums) {
		return compressorGroupService.findPowerByNums(compressorID, nums);
	}

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	public Object findByGroupId(@RequestParam int rdcId) {
		return compressorGroupSetDao.findLastNPoint(rdcId);
	}
	
	@RequestMapping("/findPressByNums")
	public Object findPressByNums(int compressorID,
			@RequestParam(value="nums",defaultValue="2")Integer nums){
		List<StorageKeyValue> lowPress = compressorGroupService.findPressLowByNums(compressorID, nums);
		List<StorageKeyValue> highPress = compressorGroupService.findPressHighByNums(compressorID, nums);
		Map result = new HashMap<String, List<StorageKeyValue>>(2);
		result.put("lowPress", lowPress);
		result.put("highPress", highPress);
		return result;
	}
}
