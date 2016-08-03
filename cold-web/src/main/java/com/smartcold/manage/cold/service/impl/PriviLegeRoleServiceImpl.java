package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.PrivilegeRoleMapper;
import com.smartcold.manage.cold.entity.olddb.PrivilegeRole;
import com.smartcold.manage.cold.service.PrivilegeRoleService;

/**
 * @author yanan.xu
 * @ClassName PriviLegeRoleServiceImpl.java
 * @Package: com.smartcold.manage.cold.service.impl
 * @Description: TODO
 * @createDate:2016/3.19
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("privilegeRoleService")
public class PriviLegeRoleServiceImpl implements PrivilegeRoleService {

	private PrivilegeRoleMapper privRoleDao;

	public PrivilegeRoleMapper getPrivRoleDao() {
		return privRoleDao;
	}

	@Autowired
	public void setPrivRoleDao(PrivilegeRoleMapper privRoleDao) {
		this.privRoleDao = privRoleDao;
	}

	/**
	 * get PrivilegeRole By RoleId
	 * 
	 * @see com.smartcold.manage.cold.service.PrivilegeRoleService#getPrivRoleByRoleId(int)
	 */
	@SuppressWarnings("finally")
	public List<PrivilegeRole> getPrivRoleByRoleId(int roleId) {
		// TODO Auto-generated method stub
		List<PrivilegeRole> privRoleList = new ArrayList<PrivilegeRole>(0);
		try {
			privRoleList = privRoleDao.getPrivRoleList(roleId);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			return privRoleList;
		}
	}

	public PrivilegeRole getPrivRoleByPrivRoleId(int privRoleId) {
		// TODO Auto-generated method stub
		return null;
	}

	public PrivilegeRole addPrivilegeRole(int priviledgeId, int roleId, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

	public PrivilegeRole modifyPrivilegeRole(int priviledgeId, int roleId, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

	public void deletePrivilegeRole(int privId, int roleId) {
		// TODO Auto-generated method stub

	}

}
