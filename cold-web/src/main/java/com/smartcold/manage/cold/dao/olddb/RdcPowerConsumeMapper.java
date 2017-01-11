package com.smartcold.manage.cold.dao.olddb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.RdcPowerConsumeEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-04 11:52)
 */
public interface RdcPowerConsumeMapper {

	List<RdcPowerConsumeEntity> findLastNPoint(@Param("rdcID") int rdcID, @Param("npoint") int npoint);

	List<RdcPowerConsumeEntity> findInfoByRdcid(@Param("rdcID") int rdcID, @Param("startTime") Date startTime,
			@Param("endTime") Date endTime);

}
