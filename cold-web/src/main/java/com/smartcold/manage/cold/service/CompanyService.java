package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.entity.Company;

public interface CompanyService {
    public Company getCompByCompId(int companyId);   
    
	public Company addCompany(String campanyName, String address, Date addTime);
    
    public void deleteCompByCompName(String campanyName);   
    public void deleteCompByCompId(int companyId);
    
    public Company modifyCompany(String campanyName, String address, Date addTime);
}