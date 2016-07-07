package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.OperationLogMapper;


@Controller
@ResponseBody
@RequestMapping("/operationLog")
public class OperationLog {
	
	@Autowired
	OperationLogMapper operationLogDao;
	
	@RequestMapping(value="/findByPage", method=RequestMethod.GET)
	public Object findByPage(@RequestParam(value = "pageNum", required = false) Integer pageNum,
			@RequestParam(value = "pageSize",required=false) Integer pageSize){
		pageNum = pageNum == null ? 1 : pageNum;
		pageSize = pageSize == null ? 10 : pageSize;
		PageHelper.startPage(pageNum, pageSize);
		return new PageInfo(operationLogDao.findByPage());
	}
}
