package com.smartcold.bgzigbee.manage.sc360.dao;

import com.smartcold.bgzigbee.manage.sc360.entity.CompanyRdc;

import java.util.List;

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