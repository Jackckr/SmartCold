package com.smartcold.manage.cold.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.UserEntity;

public interface UserMapper {

	public UserEntity findByPassword(@Param("username") String username, @Param("password") String password);

	public UserEntity findById(@Param("id") int id);
}
