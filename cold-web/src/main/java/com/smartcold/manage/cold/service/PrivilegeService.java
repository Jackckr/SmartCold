package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Privilege;


public interface PrivilegeService {
public Privilege getPrivByPrivId(int privilegeId);   
    
	public Privilege addPrivilege(String privilegeName, String address, Date addTime);
    
    public void deletePrivByPrivName(String privilegeName);   
    public void deletePrivByPrivId(int privilegeId);
    
    public Privilege modifyPrivilege(String privilegeName, String address, Date addTime);
}