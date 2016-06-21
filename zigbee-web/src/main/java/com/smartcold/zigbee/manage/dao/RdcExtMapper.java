package com.smartcold.zigbee.manage.dao;


import com.smartcold.zigbee.manage.entity.RdcExtEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RdcExtMapper {

    List<RdcExtEntity> findRdcExtList();

    List<RdcExtEntity> findRDCExtByRDCId(@Param("rdcID") int rdcID);

    int insertRdcExt(RdcExtEntity rdcExt);

    void updateRdcExt(RdcExtEntity rdcExtEntity);
    
    void increasePageView(int rdcID);
}