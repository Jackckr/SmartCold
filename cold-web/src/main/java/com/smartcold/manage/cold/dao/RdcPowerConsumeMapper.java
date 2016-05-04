package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.RdcPowerConsumeEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-04 11:52)
 */
public interface RdcPowerConsumeMapper {

    List<RdcPowerConsumeEntity> findLastNPoint(@Param("rdcID") int rdcID, @Param("npoint") int npoint);

}
