package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.UserEntity;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {

    UserEntity findUser(@Param("username") String username, @Param("password") String password);

    UserEntity findUserById(@Param("id") int id);
}
