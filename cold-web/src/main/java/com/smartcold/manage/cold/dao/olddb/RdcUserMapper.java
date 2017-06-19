package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.RdcUser;

import java.util.List;

public interface RdcUserMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(RdcUser record);

    int insertSelective(RdcUser record);

    RdcUser selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(RdcUser record);

    int updateByPrimaryKey(RdcUser record);

    RdcUser findByUserId(Integer userid);

    List<RdcUser> findsByUserId(Integer userid);
}