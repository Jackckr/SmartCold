package com.smartcold.bgzigbee.manage.dao;


import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.RdcExtEntity;

import java.util.List;

public interface RdcExtMapper {

    List<RdcExtEntity> findRdcExtList();

    List<RdcExtEntity> findRDCExtByRDCId(@Param("rdcID") int rdcID);

    int insertRdcExt(RdcExtEntity rdcExt);

    void updateRdcExt(RdcExtEntity rdcExtEntity);
    
    int deleteByRdcID(int rdcID);
}