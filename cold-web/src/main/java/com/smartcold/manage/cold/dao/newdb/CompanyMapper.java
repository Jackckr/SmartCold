package com.smartcold.manage.cold.dao.newdb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.Company;

public interface CompanyMapper {
	
    Company selectCompanyByRdcId(@Param("rdcId")Integer rdcId);
}