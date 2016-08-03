package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import com.smartcold.manage.cold.entity.olddb.CompanyRdc;

public interface CompanyRdcMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CompanyRdc record);

    int insertSelective(CompanyRdc record);

    CompanyRdc selectByPrimaryKey(Integer id);
    
    CompanyRdc selectByRdcId(Integer rdcid);

    int updateByPrimaryKeySelective(CompanyRdc record);

    int updateByPrimaryKey(CompanyRdc record);
    
    List<CompanyRdc> selectByCompId(Integer companyid);
}