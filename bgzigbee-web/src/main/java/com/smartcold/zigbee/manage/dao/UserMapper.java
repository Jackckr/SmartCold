package com.smartcold.zigbee.manage.dao;

import java.util.List;
import com.smartcold.zigbee.manage.entity.UserEntity;
import org.apache.ibatis.annotations.Param;
/**
 * 
 *@author Kaiqiang Jiang
 *@date:2016-6-22 上午11:11:51
 *@Description: User Mapper
 */
public interface UserMapper {

	UserEntity findUser(@Param("username") String username, @Param("password") String password);

	UserEntity findUserByName(@Param("username") String username);

	UserEntity findUserById(@Param("id") int id);
	
	List<UserEntity> findAllUser();

	void insertUser(UserEntity userEntity);
}
