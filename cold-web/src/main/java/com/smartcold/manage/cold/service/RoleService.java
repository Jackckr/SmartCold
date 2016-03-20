package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Role;

public interface RoleService {
	
    public Role getRoleByRoleId(int roleId);   
    
	public Role addRole(String roleName, Date addTime);
    
    public void deleteRoleByRoleName(String roleName);   
    public void deleteRoleByRoleId(int roleId);
    
    public Role modifyRole(String roleName, Date addTime); 
}