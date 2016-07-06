package com.smartcold.bgzigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.UserEntity;
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
	
	Page<UserEntity> findAllUser(@Param("audit")Integer audit, @Param("keyword")String keyword);

	int changeAudit(@Param("userID") int userID,@Param("audit") int audit);
	
	void insertUser(UserEntity userEntity);
	
	void deleteUser(@Param("id") int id);
}
