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
import com.smartcold.bgzigbee.manage.entity.ACLTreeNode;
import com.smartcold.bgzigbee.manage.entity.TeamTreeNode;
import com.smartcold.bgzigbee.manage.util.SetUtil;
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
	public Object getObjByType(Integer type, String keyword, Integer row) {
		if(type==null){return null;}
		if(row==null){row=16;}
		List<HashMap<String, Object>> reapdata=null;
		switch (type) {
		case 0://RDC
			reapdata= this.aclMapper.getRdcACLByFilter(keyword,row);
			break;
		case 1://RU
			reapdata=this.aclMapper.getRUCByFilter(keyword,row);
			break;
		case 2://User
			reapdata=this.aclMapper.getUserACLByFilter(keyword,row);
			break;
		case 3://
			reapdata=this.aclMapper.getRoleACLByFilter(keyword,row);
			break;
		case 4:
			reapdata=this.aclMapper.getGroupACLByFilter(keyword,row);
			break;
		default:
			break;
		}
		return reapdata;
	}
	
	@RequestMapping(value = "/getObjNACLByTID", method = RequestMethod.POST)
	@ResponseBody
	public Object getObjNACLByTID(int type, int id,Integer oid) {
		HashMap<String, Object> dataMap =new HashMap<String, Object>();
		switch (type) {
		case 0:
			dataMap.put("nacl", this.aclMapper.getNACLByID("ACL_RDC","RDCID",id));
			break;
		case 1:
			dataMap.put("dacl", this.aclMapper.getNACLByID("ACL_RDC","RDCID",oid));
			dataMap.put("nacl", this.aclMapper.getNACLByID("acl_ruacl","id",id));
			break;
		case 2:
			dataMap.put("nacl",this.aclMapper.getNACLByID("ACL_USER","UID",id));
			break;
		case 3:
			dataMap.put("nacl",this.aclMapper.getNACLByID("ACL_ROLE","ID",id));
			break;
		case 4:
			dataMap.put("nacl",this.aclMapper.getNACLByID("ACL_GROUP","ID",id));
			break;
		default:
			break;
		}
		return dataMap;
	}
	
	@RequestMapping(value = "/addruMapper", method = RequestMethod.POST)
	@ResponseBody
	public Object addruMapper(int rdcid,int userid,String mapper) {
		List<HashMap<String, Object>> getruacls = this.aclMapper.isextruByRUID(rdcid,userid);
		if(SetUtil.isNullList(getruacls)){
			this.aclMapper.addMapperByOid( rdcid,  userid, mapper);
			return true;
		}else{
			return getruacls;
		}
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
				table="acl_ruacl";column="RDCID";
				break;
			case 2:
				table="ACL_USER";column="UID";
				break;
			case 3:
				table="ACL_ROLE";column="ID";
				break;
			case 4:
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
				this.aclMapper.addNaclByOid(table, column, oid, nacl);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
		
	}
	
	@RequestMapping(value = "/getTreeNode", method = RequestMethod.POST)
	@ResponseBody
	public List<TeamTreeNode>  getTreeNode(Integer type,Integer rtype,Integer id,Integer pid,Integer gid,Boolean hastc ){
		if(type==null){type=5;id=0;}else if(!hastc){	type=type-1;} 
		List<TeamTreeNode> nodeList=null;
		switch (type) {
		case 2:
			if(gid==2){
				if(rtype==3||rtype==1){//
					nodeList = this.aclMapper.getRoleUserByType(rtype);
					 if(SetUtil.isnotNullList(nodeList)){
						 for (TeamTreeNode user : nodeList) {
							 user.setOpen(true);
							 user.setParent(false);
							 user.setIcon("/app/bower_components/zTree/img/user.png");
						}
					 }
				}else if(rtype==2 ){
					nodeList= this.aclMapper.getCompany();
					 if(SetUtil.isnotNullList(nodeList)){
						 for (TeamTreeNode node : nodeList) {
							
							 List<TeamTreeNode> userlist = this.aclMapper.getComptuserByCompanyId(node.getId());
							 if(SetUtil.isnotNullList(userlist)){
								 for (TeamTreeNode user : userlist) {
									 user.setOpen(true);
									 user.setParent(false);
									 user.setIcon("/app/bower_components/zTree/img/user.png");
								}
								 node.setChildren(userlist);
							 }
							 node.setHastc(false);
							 node.setParent(false);
							 node.setIcon("/app/bower_components/zTree/img/compt.png");
						}
					 }
				}
				
			}else if(gid==3){//服务商。。。
				
				
				
				
			}
			
			
			break;
		case 3:
			if(pid==0&&gid>0){
				pid=gid;gid=0;
			}else if(gid==0&&pid==0){
				gid=id;
			}
			nodeList = this.aclMapper.getTreeRoleBypid(id,pid,gid);//gid  pid
			for (TeamTreeNode node : nodeList) {
				node.setType(type);
				node.setOpen(true);
				node.setParent(true);
//				node.setIcon("/app/bower_components/zTree/img/role.png");
		  	}
			break;
		case 4:
			nodeList = this.aclMapper.getTreeACLGroupBypid(id);
			for (TeamTreeNode node : nodeList) {
				node.setType(type);
				node.setOpen(true);
				node.setParent(true);
//				node.setIcon("/app/bower_components/zTree/img/role.png");
		  	}
			break;
		case 5:
			nodeList=new ArrayList<TeamTreeNode>();
			TeamTreeNode rootnodeNode=new TeamTreeNode();
			rootnodeNode.setId(0);
			rootnodeNode.setName("ROOT");
			rootnodeNode.setIcon("/app/bower_components/zTree/img/root.png");
			rootnodeNode.setOpen(true);
			rootnodeNode.setType(5);
			List<TeamTreeNode>	roleList = this.aclMapper.getTreeACLGroupBypid(id);
			for (TeamTreeNode node : roleList) {
				node.setType(4);
				node.setOpen(true);
				node.setParent(true);
//				node.setIcon("/app/bower_components/zTree/img/group.png");
		  	}
			rootnodeNode.setChildren(roleList);
			nodeList.add(rootnodeNode);
			break;
		default:
			return null;
		}
		return  nodeList;
		
		
		
		
		
//		 return getChnode(type, id);
	}
	

	
	
	

	
	
	
	
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
