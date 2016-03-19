package com.smartcold.manage.cold.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.PrivilegeMapper;
import com.smartcold.manage.cold.entity.Privilege;
import com.smartcold.manage.cold.service.PrivilegeService;

/**
 * @author yanan.xu
 * @ClassName PrivilegeServiceImpl.java
 * @Package: com.smartcold.manage.cold.service.impl
 * @Description: TODO
 * @createDate:2016/3.19    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("privilegeService")
public class PrivilegeServiceImpl implements PrivilegeService {

	private PrivilegeMapper privDao;
	public PrivilegeMapper getPrivDao() {
		return privDao;
	}
	@Autowired
	public void setPrivDao(PrivilegeMapper privDao) {
		this.privDao = privDao;
	}
	
	/**
	 * get Privelege By Privilege
	 * 
	 * @see
	 * com.smartcold.manage.cold.service.privilegeService#getPrivByPrivId(int)
	 */
	
	@SuppressWarnings("finally")
	public Privilege getPrivByPrivId(int privilegeId) {
		// TODO Auto-generated method stub
		Privilege priv = new Privilege();
		try {
			priv = privDao.selectByPrimaryKey(privilegeId);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			return priv;
		}
	}

	public Privilege addPrivilege(String privilegeName, String address, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

	public void deletePrivByPrivName(String privilegeName) {
		// TODO Auto-generated method stub

	}

	public void deletePrivByPrivId(int privilegeId) {
		// TODO Auto-generated method stub

	}

	public Privilege modifyPrivilege(String privilegeName, String address, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}



}
