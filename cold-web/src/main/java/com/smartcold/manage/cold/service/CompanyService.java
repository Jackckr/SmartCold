package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Company;

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

public interface CompanyService {
    public Company getCompByCompId(int companyId);   
    
	public Company addCompany(String campanyName, String address, Date addTime);
    
    public void deleteCompByCompName(String campanyName);   
    public void deleteCompByCompId(int companyId);
    
    public Company modifyCompany(String campanyName, String address, Date addTime);
}