package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.SystemInformMapper;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/systemInform")
public class SystemInformController {
    
	@Autowired
	private SystemInformMapper systemInformMapper;
	
	@RequestMapping(value = "/getSystemInform", method = RequestMethod.POST)
	@ResponseBody
	public Object getObjByType(Integer type,Integer stype, String keyword, Integer pageNum,Integer pageSize ) {
		
		
		
		return null;
	}
	
}
