package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.PrivilegeRole;

/**
 * @author yanan.xu
 * @ClassName：UserService.java
 * @Package: com.smartcold.manage.cold.service
 * @Description: TODO
 * @createDate:2016/3.17下午15:58    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */

public interface PrivilegeRoleService {

	public PrivilegeRole getPrivRoleByPrivRoleId(int privRoleId);
	
	//根据角色id获取当前角色所拥有的权限
	public List<PrivilegeRole> getPrivRoleByRoleId(int roleId);
	
	public PrivilegeRole addPrivilegeRole(int priviledgeId, int roleId, Date addTime);
	
	public PrivilegeRole modifyPrivilegeRole(int priviledgeId, int roleId, Date addTime);
	
	public void deletePrivilegeRole(int privId,int roleId);
}