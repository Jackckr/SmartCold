package com.smartcold.manage.cold.service;

import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.olddb.Rdc;

public interface RdcService {
	// public Rdc getRoleByRoleId(int rdcId);
	//
	// public Rdc addRole(String rdcName, String address, Date addTime);
	//
	// public void deleteRdcByRdcName(String rdcName);
	//
	// public void deleteRoleByRdcId(int rdcId);
	//
	// public Rdc modifyRdc(String rdcName, String address, Date addTime);

	List<Rdc> findRdcByUserid(int userid);

	List<Rdc> findRdcsByUserId(int userId);
	
	Object findRdcAcl(int rdcId );
}