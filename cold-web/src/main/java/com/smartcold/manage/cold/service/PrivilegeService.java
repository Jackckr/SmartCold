package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Privilege;

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

public interface PrivilegeService {
public Privilege getPrivByPrivId(int privilegeId);   
    
	public Privilege addPrivilege(String privilegeName, String address, Date addTime);
    
    public void deletePrivByPrivName(String privilegeName);   
    public void deletePrivByPrivId(int privilegeId);
    
    public Privilege modifyPrivilege(String privilegeName, String address, Date addTime);
}