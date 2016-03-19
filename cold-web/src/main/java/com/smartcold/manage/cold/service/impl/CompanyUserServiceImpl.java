package com.smartcold.manage.cold.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.CompanyUserMapper;
import com.smartcold.manage.cold.entity.CompanyUser;
import com.smartcold.manage.cold.service.CompanyUserService;
/**
 * @author yanan.xu
 * @ClassName CompanyUserServiceImpl.java
 * @Package: com.smartcold.manage.cold.service.impl
 * @Description: TODO
 * @createDate:2016/3.19
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("companyUserService")
public class CompanyUserServiceImpl implements CompanyUserService {

	private CompanyUserMapper companyUserDao;
	
	public CompanyUserMapper getCompanyUserDao() {
		return companyUserDao;
	}
	@Autowired
	public void setCompanyUserDao(CompanyUserMapper companyUserDao) {
		this.companyUserDao = companyUserDao;
	}

	public CompanyUser getCompUserByCompUserId(int compUserId) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<CompanyUser> getCompUsersByCompanyId(int compId) {
		// TODO Auto-generated method stub
		return null;
	}
	/**
	 * get CompanyUser by UserId
	 * 
	 * @see
	 * com.smartcold.manage.cold.service.CompanyUserService#getComUserByUserId(int)
	 */
	@SuppressWarnings("finally")
	public CompanyUser getComUserByUserId(int userid) {
		// TODO Auto-generated method stub
		CompanyUser compUser = new CompanyUser();
		try{
			compUser = companyUserDao.selectByUserId(userid);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
		return compUser;	
		}
	}

}
