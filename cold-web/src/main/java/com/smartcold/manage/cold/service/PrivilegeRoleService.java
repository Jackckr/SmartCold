package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.newdb.PrivilegeRole;


public interface PrivilegeRoleService {

	public PrivilegeRole getPrivRoleByPrivRoleId(int privRoleId);

	public List<PrivilegeRole> getPrivRoleByRoleId(int roleId);
	
	public PrivilegeRole addPrivilegeRole(int priviledgeId, int roleId, Date addTime);
	
	public PrivilegeRole modifyPrivilegeRole(int priviledgeId, int roleId, Date addTime);
	
	public void deletePrivilegeRole(int privId,int roleId);
}