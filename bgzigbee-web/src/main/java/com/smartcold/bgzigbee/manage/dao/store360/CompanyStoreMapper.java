package com.smartcold.bgzigbee.manage.dao.store360;

import com.github.pagehelper.Page;

import com.smartcold.bgzigbee.manage.entity.store360.CompanyStoreEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created by qiangzi on 2017/9/14.
 */
public interface CompanyStoreMapper {
    Page<CompanyStoreEntity> findCompanyByWords(@Param("keyword") String keyword);

    CompanyStoreEntity selectByPrimaryKey(Integer id);

    int insertCompany(CompanyStoreEntity company);

    int updateByPrimaryKeySelective(CompanyStoreEntity company);

    void deleteCompany(@Param("id") int id);
}
