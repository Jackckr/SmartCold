package com.smartcold.zigbee.manage.dao;


import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.entity.RdcEntity;

public interface RdcMapper {

    List<RdcEntity> findRdcList();

    List<RdcEntity> findRDCByRDCId(@Param("rdcID") int rdcID);

    int insertRdc(RdcEntity rdc);

    void updateRdc(RdcEntity rdcEntity);
    
    int checkName(String name);
    
    boolean checkCellphone(String cellphone);
    
    /**
     * 获得睿库分页信息
     * @param parameters
     * @return
     */
    public Page<RdcEntityDTO> getRDCList(Map<String, Object> parameters);
}