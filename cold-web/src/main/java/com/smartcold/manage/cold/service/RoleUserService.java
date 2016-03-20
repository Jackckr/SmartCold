package com.smartcold.manage.cold.service;

import java.sql.Date;

import com.smartcold.manage.cold.entity.RoleUser;

/**
 * @author yanan.xu
 * @ClassName£ºUserService.java
 * @Package: com.smartcold.manage.cold.service
 * @Description: TODO
 * @createDate:2016/3.17ÏÂÎç    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */

public interface RoleUserService {
    int deleteByPrimaryKey(Integer id);
    
    public RoleUser getRoleUserByRoleUserId(int roleUserId);

    public RoleUser getRoleIdByUserId(int userId);

    public RoleUser addRoleUser(int userId, int roleId, Date addTime);
    
    public void deleteRoleUserByRoleUserId(int roleId);
    
    public RoleUser modifyRoleUser(int userId, int roleId, Date addTime);
}