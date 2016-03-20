package com.smartcold.manage.cold.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.CompanyMapper;
import com.smartcold.manage.cold.entity.Company;
import com.smartcold.manage.cold.entity.Role;
import com.smartcold.manage.cold.service.CompanyService;
/**
 * @author yanan.xu
 * @ClassName CompanyServiceImpl.java
 * @Package: com.smartcold.manage.cold.service.impl
 * @Description: TODO
 * @createDate:2016/3.19    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("companyService")
public class CompanyServiceImpl implements CompanyService {

	private CompanyMapper companyDao;
	
	public CompanyMapper getCompanyDao() {
		return companyDao;
	}
	@Autowired
	public void setCompanyDao(CompanyMapper companyDao) {
		this.companyDao = companyDao;
	}
	/**
	 * get Company by CompanyId
	 * 
	 * @see
	 * com.smartcold.manage.cold.service.CompanyService#getCompByCompId(int)
	 */
	@SuppressWarnings("finally")
	public Company getCompByCompId(int companyId) {
		// TODO Auto-generated method stub
		Company company = new Company();
		try {
		    company = companyDao.selectByPrimaryKey(companyId);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			return company;
		}
	}

	public Company addCompany(String campanyName, String address, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

	public void deleteCompByCompName(String campanyName) {
		// TODO Auto-generated method stub

	}

	public void deleteCompByCompId(int companyId) {
		// TODO Auto-generated method stub

	}

	public Company modifyCompany(String campanyName, String address, Date addTime) {
		// TODO Auto-generated method stub
		return null;
	}

}
