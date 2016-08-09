package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.Role;

public interface RoleMapper {
	
    int deleteByPrimaryKey(Integer id);

    int insert(Role record);

    int insertSelective(Role record);

    Role selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Role record);

    int updateByPrimaryKey(Role record);
    
}