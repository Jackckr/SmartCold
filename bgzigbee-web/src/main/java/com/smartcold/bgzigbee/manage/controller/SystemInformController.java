package com.smartcold.bgzigbee.manage.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.ACLMapper;
import com.smartcold.bgzigbee.manage.dao.SystemInformMapper;
import com.smartcold.bgzigbee.manage.entity.ACLTreeNode;
import com.smartcold.bgzigbee.manage.entity.TeamTreeNode;
import com.smartcold.bgzigbee.manage.util.SetUtil;
import com.smartcold.bgzigbee.manage.util.StringUtil;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/systemInform")
public class SystemInformController {
    
	@Autowired
	private SystemInformMapper systemInformMapper;
	
	
}
