package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.OperationLogMapper;


@Controller
@ResponseBody
@RequestMapping("/operationLog")
public class OperationLog {
	
	@Autowired
	OperationLogMapper operationLogDao;
	
	@RequestMapping(value="findByPage", method=RequestMethod.GET)
	public Object findByPage(){
		return new PageInfo(operationLogDao.findByPage());
	}
}
