package com.smartcold.bgzigbee.manage.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.ACLMapper;
import com.smartcold.bgzigbee.manage.entity.ACLTreeNode;
import com.smartcold.bgzigbee.manage.util.StringUtil;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/acl")
public class ACLController {
    
	@Autowired
	private ACLMapper aclMapper;
	
	/**
	 * 根据类型获得数
	 * {name:"RDC",value:"0"},{name:"RUA",value:"1"},{name:"USER",value:"2"},{name:"ROLE",value:"3"},{name:"GROUP",value:"4"}
	 * @param type
	 * @param keyword
	 * @return
	 */
	@RequestMapping(value = "/getObjByType", method = RequestMethod.POST)
	@ResponseBody
	public Object getObjByType(Integer type, String keyword) {
		if(type==null){return null;}
		List<HashMap<String, Object>> reapdata=null;
		switch (type) {
		case 0://RDC
			reapdata= this.aclMapper.getRdcACLByFilter(keyword);
			break;
		case 1://RU
			reapdata=this.aclMapper.getRUCByFilter(keyword);
			break;
		case 2://User
			reapdata=this.aclMapper.getUserACLByFilter(keyword);
			break;
		case 3://
			reapdata=this.aclMapper.getRoleACLByFilter(keyword);
			break;
		case 4:
			reapdata=this.aclMapper.getGroupACLByFilter(keyword);
			break;
		default:
			break;
		}
		return reapdata;
	}
	
	@RequestMapping(value = "/getObjNACLByTID", method = RequestMethod.POST)
	@ResponseBody
	public Object getObjNACLByTID(Integer type, int id) {
		if(type==null){return null;}
		List<HashMap<String, Object>> reapdata=null;
		switch (type) {
		case 0:
			reapdata= this.aclMapper.getNACLByID("ACL_RDC","RDCID",id);
			break;
		case 1:
			reapdata= this.aclMapper.getNACLByID("acl_ruacl","id",id);
			break;
		case 2:
			reapdata= this.aclMapper.getNACLByID("ACL_USER","UID",id);
			break;
		case 3:
			reapdata= this.aclMapper.getNACLByID("ACL_ROLE","ID",id);
			break;
		case 4:
			reapdata= this.aclMapper.getNACLByID("ACL_GROUP","ID",id);
			break;
		default:
			break;
		}
		return reapdata;
	}
	
	
	@RequestMapping(value = "/upObjNACLByTID", method = RequestMethod.POST)
	@ResponseBody
	public boolean upObjNACLByTID(Integer type, Integer id,Integer oid,String nacl) {
		try {
			if(type==null){return false;}
			String table=null;String column=null; 
			switch (type) {
			case 0:
				table="ACL_RDC";column="RDCID";
				break;
			case 1:
				table="ACL_USER";column="UID";
				break;
			case 2:
				table="ACL_ROLE";column="ID";
				break;
			case 3:
				table="ACL_GROUP";column="ID";
				break;
			default:
				return false;
			}
			
			if(id!=null){//修改
				if(StringUtil.isNull(nacl)){
					this.aclMapper.delACLById(table, id);
				}else{
				   this.aclMapper.upACLByID(table, id, nacl);
				}
			}else if(oid!=null){//添加
				if(StringUtil.isnotNull(nacl)){
					this.aclMapper.addNaclByOid(table, column, oid, nacl);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
		
	}
//	public List<ACLTreeNode> getAllNode();
	
	/**
	 * 获得动态菜单
	 * @param uid
	 * @param rdcid
	 * @return
	 */
	@RequestMapping(value = "/getACLNode")
	@ResponseBody
	public List<ACLTreeNode> getACLMenus(int uid,String nacl){
		return this.geNnodes(0,nacl);
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
