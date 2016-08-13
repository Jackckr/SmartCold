package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.UserEntity;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {

	UserEntity findUser(@Param("username") String username, @Param("password") String password);

	UserEntity findUserByName(@Param("username") String username);

	UserEntity findUserById(@Param("id") int id);

	void insertUser(UserEntity userEntity);
	
	void updateUser(UserEntity userEntity);
	
	public int upPwdByTelephone(UserEntity userEntity);
	
	public int existenceUserName(@Param("username")String username);
}
