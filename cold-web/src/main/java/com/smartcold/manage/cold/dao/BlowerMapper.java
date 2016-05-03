package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.BlowerEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface BlowerMapper {
    List<BlowerEntity> findLastNPoint(@Param("blowerId") int blowerId, @Param("npoint") int npoint);
    List<BlowerEntity> findAllByBlowerId(@Param("blowerId") int blowerId);
}
