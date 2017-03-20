package com.smartcold.manage.cold.controller;


import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.ACLMapper;
import com.smartcold.manage.cold.entity.newdb.ACLTreeNode;

@Controller
@RequestMapping(value = "/acl")
public class ACLController extends BaseController {
  
	@Autowired
	private ACLMapper aclMapper;
	
	/**
	 * 获得动态菜单
	 * @param uid
	 * @param rdcid
	 * @return
	 */
	@RequestMapping(value = "/getRUACL")
	@ResponseBody
	public Object getRUACL(int uid,int rdcid){
		HashMap<String, Object> respData=new HashMap<String, Object>();
		 String ruacl = this.aclMapper.getRUACL(uid, rdcid);
		 List<ACLTreeNode> allaclNode = this.aclMapper.getALLACLNode(ruacl);
		 respData.put("nacl", ruacl);
		 respData.put("aclml", allaclNode);
		 return respData;
		 
	}
	/**
	 * 获得动态菜单
	 * @param uid
	 * @param rdcid
	 * @return
	 */
	@RequestMapping(value = "/getACLNode")
	@ResponseBody
	public List<ACLTreeNode> getACLMenus(int uid,int rdcid){
		return this.geNnodes(0,this.aclMapper.getRUACL(uid, rdcid));
	}
	
	/**
	 * 
	 * @param pid
	 * @param nacl
	 * @return
	 */
	private List<ACLTreeNode> geNnodes(int pid,String nacl){
		List<ACLTreeNode> nodes = this.aclMapper.getACLNodeByPid(pid,nacl);
		for (ACLTreeNode node : nodes) {
			if(node.isHasnode()){
				node.setNodes( this.geNnodes(node.getId(), nacl));
			}
		}
		return nodes;
	}
}
