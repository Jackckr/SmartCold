package com.smartcold.manage.cold.service.impl;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.RoleUserMapper;
import com.smartcold.manage.cold.entity.olddb.RoleUser;
import com.smartcold.manage.cold.service.RoleUserService;

/**
 * @author yanan.xu
 * @ClassName RoleUserServiceImpl.java
 * @Package: com.smartcold.manage.cold.service.impl
 * @Description: TODO
 * @createDate:2016/3.19    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("roleUserService")
public class RoleUserServiceImpl implements RoleUserService {

	private RoleUserMapper roleUserDao;
	public RoleUserMapper getRoleUserDao() {
		return roleUserDao;
	}
	@Autowired
	public void setRoleUserDao(RoleUserMapper roleUserDao) {
		this.roleUserDao = roleUserDao;
	}
	
	/**
	 * get RoleId by UserId
	 * 
	 * @see
	 * com.smartcold.manage.cold.service.RoleUserService#getRoleIdByUserId(int)
	 */
	
	@SuppressWarnings("finally")
	public RoleUser getRoleIdByUserId(int userId) {
		// TODO Auto-generated method stub
		RoleUser roleUser = new RoleUser();
		try {
			roleUser = roleUserDao.getRoleUserByUserId(userId);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			return roleUser;
		}
	}
	
	public int deleteByPrimaryKey(Integer id) {
		// TODO Auto-generated method stub
		return 0;
	}

	public RoleUser getRoleUserByRoleUserId(int roleUserId) {
		// TODO Auto-generated method stub
		return null;
	}

	public RoleUser addRoleUser(int userId, int roleId, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

	public void deleteRoleUserByRoleUserId(int roleId) {
		// TODO Auto-generated method stub

	}

	public RoleUser modifyRoleUser(int userId, int roleId, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

}
