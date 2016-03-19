package com.smartcold.manage.cold.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.UserEntity;

public interface UserMapper {

	public UserEntity findByPassword(@Param("username") String username, @Param("password") String password);

	public UserEntity findById(@Param("id") int id);
	
	int deleteByPrimaryKey(Integer id);

    int insert(UserEntity record);

    int insertSelective(UserEntity record);

    UserEntity selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UserEntity record);

    int updateByPrimaryKey(UserEntity record);
    
    List<UserEntity> findUserByNAndP(UserEntity user);
    
	List<UserEntity> findUserByName(UserEntity user);
	
	List<UserEntity> findAllUsers();
}
