package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.UserEntity;

public interface UserMapper {



	public UserEntity findById(@Param("id") int id);
	
	int deleteByPrimaryKey(Integer id);

    int insert(UserEntity record);

    int insertSelective(UserEntity record);

    UserEntity selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(UserEntity record);

    int updateByPrimaryKey(UserEntity record);
  
    
    UserEntity findUserByName(@Param("username") String username);
	
	List<UserEntity> findAllUsers();
	
    int insertUser(UserEntity user);
    
	public int existenceUserName(@Param("username")String username);

	void updateTypeById(UserEntity userEntity);

    UserEntity findUserByTelephone(String phone);
    
    
	public UserEntity Login(@Param("username") String username, @Param("password") String password);
	@Deprecated
	List<UserEntity> findUserByNAndP(UserEntity user);
	@Deprecated
	public UserEntity findByPassword(@Param("username") String username, @Param("password") String password);
}
