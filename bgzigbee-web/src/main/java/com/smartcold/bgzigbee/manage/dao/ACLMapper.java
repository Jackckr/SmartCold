package com.smartcold.bgzigbee.manage.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.ACLTreeNode;



/**
 * 
 *@date:2016-6-22 上午11:11:51
 *@Description: Admin Mapper
 */
public interface ACLMapper {
	
	public List<HashMap<String, Object>> getRdcACLByFilter(@Param("keyword")String keyword);
	public List<HashMap<String, Object>> getUserACLByFilter(@Param("keyword")String keyword);
	public List<HashMap<String, Object>> getRoleACLByFilter(@Param("keyword")String keyword);
	public List<HashMap<String, Object>> getGroupACLByFilter(@Param("keyword")String keyword);
	
	public void delACLById(@Param("table")String table, @Param("id") Integer id);
	public void upACLByID(@Param("table")String table, @Param("id") Integer id,@Param("nacl")String nacl);
	public void addNaclByOid(@Param("table")String table,  @Param("column")String  column, @Param("oid") Integer oid,@Param("nacl")String nacl);
	
	
	
	public List<ACLTreeNode> getAllNode();
	public List<ACLTreeNode> getACLNodeByPid(@Param("pid")Integer pid,@Param("nacl")String nacl);
	public List<HashMap<String, Object>> getNACLByID(@Param("table")String table, @Param("column")String  column, @Param("id") Integer id);
	
}
