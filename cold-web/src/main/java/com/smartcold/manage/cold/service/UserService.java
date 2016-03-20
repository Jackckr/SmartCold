package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.entity.UserEntity;

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
	
	public UserEntity findUserById(int id) throws Exception;
	
	public boolean isUserExist(String username,String password) throws Exception;
	
	public UserEntity getUserByUserName(String username);
	
	public UserEntity getUserByNAndP(String username, String password);
	
	public UserEntity addUser(String username, String password, 
            String telephone, String email, int role);
    
    public void deleteUserByUserId(String userId);
    
    public UserEntity modifyUser(int userId, String username, String password, 
            String telephone, String email, int role);
}