package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.PrivilegeRole;

public interface PrivilegeRoleMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(PrivilegeRole record);

    int insertSelective(PrivilegeRole record);

    PrivilegeRole selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(PrivilegeRole record);

    int updateByPrimaryKey(PrivilegeRole record);
    
    List<PrivilegeRole> getPrivRoleList(Integer roleId);
}