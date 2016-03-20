package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Rdc;


public interface RdcService {
    public Rdc getRoleByRoleId(int rdcId);   
    
	public Rdc addRole(String rdcName, String address, Date addTime);
    
    public void deleteRdcByRdcName(String rdcName);   
    public void deleteRoleByRdcId(int rdcId);
    
    public Rdc modifyRdc(String rdcName, String address, Date addTime);
}