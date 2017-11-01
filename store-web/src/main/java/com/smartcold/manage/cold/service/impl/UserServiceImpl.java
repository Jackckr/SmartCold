package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.UserService;
import com.sun.org.apache.regexp.internal.recompile;

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
	@Autowired
	private UserMapper userDao;

	public UserEntity login(String username, String password) {
		try {
			return userDao.login(username, password);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} 
	}


	

}
