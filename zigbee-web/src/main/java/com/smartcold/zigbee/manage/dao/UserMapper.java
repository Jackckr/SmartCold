package com.smartcold.zigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.UserEntity;

public interface UserMapper {

	public UserEntity findUser(@Param("username") String username, @Param("password") String password);
}
