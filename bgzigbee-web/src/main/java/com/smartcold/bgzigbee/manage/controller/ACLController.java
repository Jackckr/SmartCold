package com.smartcold.bgzigbee.manage.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.ACLMapper;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/acl")
public class ACLController {
    
	@Autowired
	private ACLMapper aclMapper;
	
	@RequestMapping(value = "/getObjByType", method = RequestMethod.POST)
	@ResponseBody
	public Object getObjByType(Integer type, String keyword) {
		if(type==null){return null;}
		List<HashMap<String, Object>> reapdata=null;
		switch (type) {
		case 0:
			reapdata= this.aclMapper.getRdcACLByFilter(keyword);
			break;
		case 1:
			reapdata=this.aclMapper.getUserACLByFilter(keyword);
			break;
		case 2:
			reapdata=this.aclMapper.getRoleACLByFilter(keyword);
			break;
		case 3:
			reapdata=this.aclMapper.getGroupACLByFilter(keyword);
			break;
		default:
			break;
		}
		return reapdata;
	}
	
	
	
	
}
