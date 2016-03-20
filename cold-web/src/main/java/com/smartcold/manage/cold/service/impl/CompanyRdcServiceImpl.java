package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.CompanyRdcMapper;
import com.smartcold.manage.cold.entity.CompanyRdc;
import com.smartcold.manage.cold.service.CompanyRdcService;
/**
 * @author yanan.xu
 * @ClassName CompanyRdcServiceImpl.java
 * @Package: com.smartcold.manage.cold.service.impl
 * @Description: TODO
 * @createDate:2016/3.19    
 * @email:xuyanan03@meituan.com
 * @phone:15228355992
 * @Address:yunwei of DP
 * @version:V1.0
 */
@Service("companyRdcService")
public class CompanyRdcServiceImpl implements CompanyRdcService {

	private CompanyRdcMapper companyRdcDao;
	public CompanyRdc getCompRdcByCompRdcId(int companyRdcId) {
		// TODO Auto-generated method stub
		return null;
	}
	/**
	 * get CompanyRdc by CompanyId
	 * 
	 * @see
	 * com.smartcold.manage.cold.service.CompanyRdcService#getCompRdcsByCompId(int)
	 */
	@SuppressWarnings("finally")
	public List<CompanyRdc> getCompRdcsByCompId(int companyId) {
		// TODO Auto-generated method stub
		List<CompanyRdc> compRdcList = new ArrayList<CompanyRdc>();
		try{
			compRdcList = companyRdcDao.selectByCompId(companyId);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			return compRdcList;
		}

	}

	public CompanyRdcMapper getCompanyRdcDao() {
		return companyRdcDao;
	}
	@Autowired
	public void setCompanyRdcDao(CompanyRdcMapper companyRdcDao) {
		this.companyRdcDao = companyRdcDao;
	}

}
