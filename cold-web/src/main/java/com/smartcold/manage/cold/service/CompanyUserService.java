package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.CompanyUser;

public interface CompanyUserService {
    public CompanyUser getCompUserByCompUserId(int compUserId);
	
	public List<CompanyUser> getCompUsersByCompanyId(int compId);
	
	public CompanyUser getComUserByUserId(int userId);
}