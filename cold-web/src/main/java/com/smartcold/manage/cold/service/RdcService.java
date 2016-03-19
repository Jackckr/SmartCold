package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Rdc;

/**
 * @author yanan.xu
 * @ClassName£ºUserService.java
 * @Package: com.smartcold.manage.cold.service
 * @Description: TODO
 * @createDate:2016/3.17ÏÂÎç15:58    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */

public interface RdcService {
    public Rdc getRoleByRoleId(int rdcId);   
    
	public Rdc addRole(String rdcName, String address, Date addTime);
    
    public void deleteRdcByRdcName(String rdcName);   
    public void deleteRoleByRdcId(int rdcId);
    
    public Rdc modifyRdc(String rdcName, String address, Date addTime);
}