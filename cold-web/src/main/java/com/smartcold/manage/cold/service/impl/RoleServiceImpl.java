package com.smartcold.manage.cold.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.RoleMapper;
import com.smartcold.manage.cold.entity.Role;
import com.smartcold.manage.cold.service.RoleService;

/**
 * @author yanan.xu
 * @ClassName RoleServiceImpl.java
 * @Package: com.smartcold.manage.cold.service.impl
 * @Description: TODO
 * @createDate:2016/3.17
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("roleService")
public class RoleServiceImpl implements RoleService {

	private RoleMapper roleDao;
	
	public RoleMapper getRoleDao() {
		return roleDao;
	}
	@Autowired
	public void setRoleDao(RoleMapper roleDao) {
		this.roleDao = roleDao;
	}
	
	/**
	 * get Role By RoleId
	 * 
	 * @see
	 * com.smartcold.manage.cold.service.RoleService#getRoleByRoleId(int)
	 */
	@SuppressWarnings("finally")
	public Role getRoleByRoleId(int roleId) {
		// TODO Auto-generated method stub
		Role role = new Role();
		try {
		    role = roleDao.selectByPrimaryKey(roleId);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			return role;
		}
	}

	public Role addRole(String roleName, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

	public void deleteRoleByRoleName(String roleName) {
		// TODO Auto-generated method stub

	}

	public void deleteRoleByRoleId(int roleId) {
		// TODO Auto-generated method stub

	}

	public Role modifyRole(String roleName, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

}
