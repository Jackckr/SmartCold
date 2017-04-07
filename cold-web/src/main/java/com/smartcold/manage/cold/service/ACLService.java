package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.ACLTreeNode;



public interface ACLService {
	
	public String getRUAclByRUID(int rdcid,int uid);
	
	public List<ACLTreeNode> getALLACLNode(String nacl);
	
	
}