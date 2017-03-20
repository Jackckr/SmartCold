package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.ACLTreeNode;

/**
 * 权限控制
 * @author Administrator
 *
 */
public interface ACLMapper {
	/**
	 * 用户权限
	 * @param uid
	 * @param rdcid
	 * @return
	 */
	public String getUserACL(@Param("uid")Integer uid);
	
	public String getRDCACL(@Param("rdcid")Integer rdcid);
	
	public String getRUACL(@Param("uid")Integer uid,@Param("rdcid")Integer rdcid);
	
	public List<ACLTreeNode> getALLACLNode(@Param("nacl")String nacl);
	
	public List<ACLTreeNode> getACLNodeByPid(@Param("pid")Integer pid,@Param("nacl")String nacl);
	
}
