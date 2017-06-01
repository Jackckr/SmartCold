package com.smartcold.bgzigbee.manage.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.ACLTreeNode;
import com.smartcold.bgzigbee.manage.entity.TeamTreeNode;



/**
 * 
 *@date:2016-6-22 上午11:11:51
 *@Description: Admin Mapper
 */
public interface ACLMapper {
	//
	public List<HashMap<String, Object>> getRdcACLByFilter(@Param("keyword")String keyword,@Param("row")Integer row);//1
	public List<HashMap<String, Object>> getRUCByFilter(@Param("keyword")String keyword,@Param("row")Integer row);//2
	public List<HashMap<String, Object>> getUserACLByFilter(@Param("keyword")String keyword,@Param("row")Integer row);//3
	public List<HashMap<String, Object>> getRoleACLByFilter(@Param("keyword")String keyword,@Param("row")Integer row);//4
	public List<HashMap<String, Object>> getGroupACLByFilter(@Param("keyword")String keyword,@Param("row")Integer row);//5
	
	public List<HashMap<String, Object>> isextruByRUID(@Param("rdcid")Integer rdcid,@Param("userid")Integer userid);//
	
	public void delACLById(@Param("table")String table, @Param("id") Integer id);
	public void upACLByID(@Param("table")String table, @Param("id") Integer id,@Param("nacl")String nacl);
	public void addMapperByOid(@Param("rdcid")Integer rdcid, @Param("userid")Integer userid, @Param("mapper")String mapper);
	public void addNaclByOid(@Param("table")String table,  @Param("column")String  column, @Param("oid") Integer oid,@Param("nacl")String nacl);
	
	public void upuserAcl(@Param("uid")int uid,@Param("roleid")int roleid,@Param("nacl")String nacl);//更新权限或者继承权限
	public void adduserAcl(@Param("uid")int uid,@Param("roleid")int roleid,@Param("nacl")String nacl);//加入权限或者继承权限
	
	public List<ACLTreeNode> getAllNode();
	public List<ACLTreeNode> getACLNodeByPid(@Param("pid")Integer pid,@Param("nacl")String nacl);
	public List<HashMap<String, Object>> getNACLByID(@Param("table")String table, @Param("column")String  column, @Param("id") Integer id);
	
	public List<TeamTreeNode> getTreeACLGroupBypid(@Param("oid") Integer oid);
	public List<TeamTreeNode> getTreeRoleBypid(@Param("id") Integer id,@Param("pid") Integer pid,@Param("gid") Integer gid);
	public List<TeamTreeNode> getTreeUserBypid(@Param("roleid") Integer roleid);
//	public List<TeamTreeNode> getTreeObjBypid(@Param("table")String table,  @Param("column")String  column, @Param("oid") Integer oid,@Param("isopen")boolean isopen);
	
	public List<TeamTreeNode> getCompany();//获得集团
	public List<TeamTreeNode> getRoleUserByType(@Param("roletype") Integer roletype);//获得集团
	public List<TeamTreeNode> getComptuserByCompanyId(@Param("companyid") Integer companyid);//获得集团
}
