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

	void deleteUser(@Param("id") int id);
	
	void deleteUsers(@Param("ids") String ids);
	
	void insertUser(UserEntity userEntity);
	
	void updateUser(UserEntity userEntity);
	
	UserEntity findUserById(@Param("id") int id);
	
	UserEntity findUserByName(@Param("username") String username);
	
	int changeUserType(@Param("ids")String ids, @Param("type")int type);

	int changeAudit(@Param("userID") int userID,@Param("audit") int audit);
	
	com.smartcold.zigbee.manage.entity.UserEntity findZWUserById(@Param("id") int id);
	
	UserEntity findUser(@Param("username") String username, @Param("password") String password);
	
	Page<UserEntity> findAllUser(@Param("audit")Integer audit,@Param("type")Integer type, @Param("keyword")String keyword);
	
	Page<UserEntity> findUserByFilter(@Param("type")Integer type,@Param("audit")Integer audit,@Param("coleam")String coleam,@Param("colval")String colval);
	
}
