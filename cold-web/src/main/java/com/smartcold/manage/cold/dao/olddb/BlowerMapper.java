package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.BlowerEntity;

import java.util.List;

public interface BlowerMapper {
    List<BlowerEntity> findLastNPoint(@Param("blowerId") int blowerId, @Param("npoint") int npoint);
    List<BlowerEntity> findAllByBlowerId(@Param("blowerId") int blowerId);
    List<BlowerEntity> findBlowerByRdcID(@Param("rdcId") int rdcId);
}
