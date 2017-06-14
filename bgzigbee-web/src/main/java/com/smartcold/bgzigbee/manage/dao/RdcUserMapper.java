package com.smartcold.bgzigbee.manage.dao;


import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.RdcUser;

import java.util.List;

public interface RdcUserMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(RdcUser record);

    int insertSelective(RdcUser record);

    RdcUser selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(RdcUser record);

    int updateByPrimaryKey(RdcUser record);

    RdcUser findByUserId(Integer userid);

    RdcUser findByRdcId(Integer rdcid);
    
    RdcUser findByRUID(@Param("userid")Integer userid,@Param("rdcid")Integer rdcid);

    List<RdcUser> getByRUID(Integer userId);
}