package com.smartcold.bgzigbee.manage.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
	public Object getObjByType(@RequestParam(value = "type", required = false)Integer type,
							   @RequestParam(value = "stype", required = false)Integer stype,
							   @RequestParam(value = "status", required = false)Integer status,
							   @RequestParam(value = "isReady", required = false)Integer isRead,
							   @RequestParam(value = "keyword", required = false)String keyword,
							   @RequestParam(value = "pageNum", required = false)Integer pageNum,
							   @RequestParam(value = "pageSize", required = false)Integer pageSize) {
		if (keyword==null || keyword.trim().equals("")){
			keyword=null;
		}else {
			keyword="%"+keyword+"%";
		}
		if (type!=null){
			type=type==-2?null:type;
		}
		if (stype!=null){
			stype=stype==-2?null:stype;
		}
		if (isRead!=null){
			isRead=isRead==-2?null:isRead;
		}
		if (status!=null){
			status=status==-2?null:status;
		}
		pageNum = pageNum == null ? 1 : pageNum;
		pageSize = pageSize == null ? 10 : pageSize;
		PageHelper.startPage(pageNum, pageSize);
		return new PageInfo(systemInformMapper.getSystemInform(type,stype,isRead,status,keyword));
	}
}
