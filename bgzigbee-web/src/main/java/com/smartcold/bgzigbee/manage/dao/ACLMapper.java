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
	
	
	
	
	
	
	public List<ACLTreeNode> getAllNode();
	public List<ACLTreeNode> getACLNodeByPid(@Param("pid")Integer pid,@Param("nacl")String nacl);
	public List<HashMap<String, Object>> getNACLByID(@Param("table")String table, @Param("column")String  column, @Param("id") Integer id);
	
	public List<TeamTreeNode> getTreeACLGroupBypid(@Param("oid") Integer oid);
	public List<TeamTreeNode> getTreeRoleBypid(@Param("gid") Integer gid,@Param("pid") Integer pid);
	public List<TeamTreeNode> getTreeUserBypid(@Param("roleid") Integer roleid);
	
	public List<TeamTreeNode> getTreeObjBypid(@Param("table")String table,  @Param("column")String  column, @Param("oid") Integer oid,@Param("isopen")boolean isopen);
	
}
