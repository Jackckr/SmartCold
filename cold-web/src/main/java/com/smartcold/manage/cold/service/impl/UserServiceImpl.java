package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.UserService;

/**
 * @author yanan.xu
 * @ClassName UserService.java
 * @Package: com.smartcold.manage.cold.service
 * @Description: TODO
 * @createDate:2016/3.19
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("userService")
public class UserServiceImpl implements UserService {

	private UserMapper userDao;

	public UserMapper getUserDao() {
		return userDao;
	}

	@Autowired
	public void setUserDao(UserMapper userDao) {
		this.userDao = userDao;
	}

	/**
	 * 
	 * @see com.smartcold.manage.cold.service.UserService#getUserByNAndP(java.lang.String
	 *      , java.lang.String)
	 */
	@SuppressWarnings("finally")
	public UserEntity getUserByNAndP(String username, String password) {
		// TODO Auto-generated method stub
		UserEntity user = new UserEntity();
		try {
			UserEntity user1 = new UserEntity();
			user1.setUsername(username);
			user1.setPassword(password);
			List<UserEntity> list = userDao.findUserByNAndP(user1);
			if (list.size() > 0) {
				user = list.get(0);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			return user;
		}
	}

	@SuppressWarnings("finally")
	public UserEntity findUserById(int id) throws Exception {
		// TODO Auto-generated method stub
		UserEntity user = new UserEntity();
		try {
			user = userDao.selectByPrimaryKey(id);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			return user;
		}
	}

	public boolean isUserExist(String username, String password) throws Exception {
		// TODO Auto-generated method stub
		return false;
	}

	public UserEntity getUserByUserName(String username) {
		// TODO Auto-generated method stub
		return null;
	}

	public UserEntity addUser(String username, String password, String telephone, String email, int role) {
		// TODO Auto-generated method stub
		return null;
	}

	public void deleteUserByUserId(String userId) {
		// TODO Auto-generated method stub

	}

	public UserEntity modifyUser(int userId, String username, String password, String telephone, String email,
			int role) {
		// TODO Auto-generated method stub
		return null;
	}

}
