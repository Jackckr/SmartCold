package com.smartcold.manage.cold.controller;


import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.entity.newdb.ACLTreeNode;
import com.smartcold.manage.cold.service.ACLService;

@Controller
@RequestMapping(value = "/acl")
public class ACLController extends BaseController {
  
	@Autowired
	private ACLService aclService;
	
	/**
	 * 获得动态菜单
	 * @param uid
	 * @param rdcid
	 * @return
	 */
	@RequestMapping(value = "/getRUACL", method = RequestMethod.POST)
	@ResponseBody
	public Object getRUACL(int uid,int rdcid){
		HashMap<String, Object> respData=new HashMap<String, Object>();
		 String ruacl = this.aclService.getRUAclByRUID( rdcid,uid);
		 List<ACLTreeNode> allaclNode = this.aclService.getALLACLNode(ruacl);
		 respData.put("nacl", ruacl);
		 respData.put("aclml", allaclNode);
		 return respData;
		 
	}

	
	
}
