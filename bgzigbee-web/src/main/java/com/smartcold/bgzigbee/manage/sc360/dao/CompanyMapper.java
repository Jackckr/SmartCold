package com.smartcold.bgzigbee.manage.sc360.dao;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.sc360.entity.Company;
import org.apache.ibatis.annotations.Param;

public interface CompanyMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Company record);

    int insertSelective(Company record);

    Company selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Company record);

    int updateByPrimaryKey(Company record);

    Company findCompanyByName(@Param("name") String name);

    Page<Company> findAllCompany(@Param("keyword") String keyword);

    void deleteCompany(@Param("id") int id);
}