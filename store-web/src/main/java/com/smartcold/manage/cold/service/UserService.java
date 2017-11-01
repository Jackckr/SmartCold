package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.entity.olddb.UserEntity;


/**
 * @author yanan.xu
 * @ClassName UserService.java
 * @Package: com.smartcold.manage.cold.service
 * @Description: TODO
 * @createDate:2016/3.17
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */

public interface UserService {
	
	public UserEntity login(String username, String password);
	
	
}