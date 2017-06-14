package com.smartcold.bgzigbee.manage.sc360.dao;


import com.smartcold.bgzigbee.manage.sc360.entity.CompanyUser;

import java.util.List;

public interface CompanyUserMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CompanyUser record);

    int insertSelective(CompanyUser record);

    CompanyUser selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(CompanyUser record);

    int updateByPrimaryKey(CompanyUser record);
    
    CompanyUser selectByUserId(Integer userid);

    List<CompanyUser> selectByCompanyId(Integer companyid);

    List<CompanyUser> selectByUid(Integer userId);
}