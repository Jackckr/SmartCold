package com.smartcold.zigbee.manage.dao;


import com.smartcold.zigbee.manage.dto.RdcScoreDTO;
import com.smartcold.zigbee.manage.entity.RdcExtEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RdcExtMapper {

    List<RdcExtEntity> findRdcExtList();

    List<RdcExtEntity> findRDCExtByRDCId(@Param("rdcID") int rdcID);

    int insertRdcExt(RdcExtEntity rdcExt);

    void updateRdcExt(RdcExtEntity rdcExtEntity);
    
    int deleteByRdcID(int rdcID);
    
    void increasePageView(int rdcID);

    List<RdcScoreDTO> findScoreRdcDTOList(@Param("npoint") int npoint);

    List<RdcScoreDTO> findHotRdcDTOList(@Param("npoint") int npoint);
}