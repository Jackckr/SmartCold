package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.UserEntity;

public interface UserMapper {
    
	public UserEntity login(@Param("username") String username, @Param("password") String password);
}
