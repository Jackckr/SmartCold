package com.smartcold.manage.cold.service;

import java.sql.Date;

import com.smartcold.manage.cold.entity.RoleUser;


public interface RoleUserService {
    int deleteByPrimaryKey(Integer id);
    
    public RoleUser getRoleUserByRoleUserId(int roleUserId);

    public RoleUser getRoleIdByUserId(int userId);

    public RoleUser addRoleUser(int userId, int roleId, Date addTime);
    
    public void deleteRoleUserByRoleUserId(int roleId);
    
    public RoleUser modifyRoleUser(int userId, int roleId, Date addTime);
}