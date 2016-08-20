package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.RoleUser;

public interface RoleUserMapper {

    int deleteByPrimaryKey(Integer id);

    int insert(RoleUser record);

    int insertSelective(RoleUser record);

    RoleUser selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(RoleUser record);

    int updateByPrimaryKey(RoleUser record);
    
    RoleUser getRoleUserByUserId(Integer userId);
}