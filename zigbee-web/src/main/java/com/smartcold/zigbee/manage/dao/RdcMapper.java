package com.smartcold.zigbee.manage.dao;


import com.smartcold.zigbee.manage.entity.RdcEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RdcMapper {

    List<RdcEntity> findRdcList();

    List<RdcEntity> findRDCByRDCId(@Param("rdcID") int rdcID);

    int insertRdc(RdcEntity rdc);

    void updateRdc(RdcEntity rdcEntity);
    
    boolean checkName(String name);
    
    boolean checkCellphone(String cellphone);
}