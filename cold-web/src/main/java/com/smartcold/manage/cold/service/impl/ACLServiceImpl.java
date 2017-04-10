package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.ACLMapper;
import com.smartcold.manage.cold.entity.newdb.ACLEntity;
import com.smartcold.manage.cold.entity.newdb.ACLTreeNode;
import com.smartcold.manage.cold.service.ACLService;
import com.smartcold.manage.cold.util.StringUtil;

@Service("aclService")
public class ACLServiceImpl implements ACLService {

	@Autowired
	private ACLMapper aclMapper;
	public ACLMapper getAclMapper() {return aclMapper;}
	public void setAclMapper(ACLMapper aclMapper) {this.aclMapper = aclMapper;}

	@Override
	public String getRUAclByRUID(int rdcid, int uid) {
		String naacl= this.aclMapper.getRUACL(rdcid, uid);//冷库和用户权限
		 if(StringUtil.isnotNull(naacl)){ return naacl; } 
		 naacl = this.aclMapper.getRdcACL(rdcid);//冷库权限
		 ACLEntity nacl =this.aclMapper.getUserACL(uid);
		 if(nacl!=null){
			 if(StringUtil.isnotNull(nacl.getUnacl())){
				 return  naacl+","+nacl.getUnacl();
			 }
			 if(StringUtil.isnotNull(nacl.getRnacl())){
				 return naacl+","+nacl.getRnacl();
			 }
			 if(StringUtil.isnotNull(nacl.getGnacl())){
				 return naacl+","+ nacl.getGnacl();
			 }
		 }
		return naacl;
	}
	@Override
	public List<ACLTreeNode> getALLACLNode(String nacl) {
		return this.aclMapper.getALLACLNode(nacl);
	}

	

}
