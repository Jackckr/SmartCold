package com.smartcold.manage.cold.dao.olddb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.ACLEntity;
import com.smartcold.manage.cold.entity.newdb.ACLTreeNode;

/**
 * 权限控制
 * @author Administrator
 *
 */
public interface ACLMapper {
	
	public String getRdcACL(@Param("oid")Integer oid);
	public ACLEntity getUserACL(@Param("uid")Integer uid);
	public String getRUACL(@Param("rdcid")Integer rdcid,@Param("uid")Integer uid);
	
	
	public List<ACLTreeNode> getALLACLNode(@Param("nacl")String nacl);
	
	public List<ACLTreeNode> getACLNodeByPid(@Param("pid")Integer pid,@Param("nacl")String nacl);
	
	public void upuserAcl(@Param("uid")int uid,@Param("roleid")int roleid,@Param("nacl")String nacl);//更新权限或者继承权限
	public void adduserAcl(@Param("uid")int uid,@Param("roleid")int roleid,@Param("nacl")String nacl);//加入权限或者继承权限
	public List<HashMap<String, Object>> getNACLByID(@Param("table")String table, @Param("column")String  column, @Param("id") Integer id);
	
}
