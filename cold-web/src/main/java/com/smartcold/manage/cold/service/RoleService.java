package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Role;

/**
 * @author yanan.xu
 * @ClassName£ºUserService.java
 * @Package: com.smartcold.manage.cold.service
 * @Description: TODO
 * @createDate:2016/3.17ÏÂÎç    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */

public interface RoleService {
	
    public Role getRoleByRoleId(int roleId);   
    
	public Role addRole(String roleName, Date addTime);
    
    public void deleteRoleByRoleName(String roleName);   
    public void deleteRoleByRoleId(int roleId);
    
    public Role modifyRole(String roleName, Date addTime); 
}