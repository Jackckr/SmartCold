package com.smartcold.manage.cold.dao.olddb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.ColdStorageDoorEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 10:16)
 */
public interface ColdStorageDoorMapper {
	List<ColdStorageDoorEntity> findLastNPoint(@Param("coldStorageDoorId") int storageID, @Param("npoint") int npoint);

	public List<ColdStorageDoorEntity> findInfoByIdTime(@Param("coldStorageDoorIds") List<Integer> doorIDs,
			@Param("startTime") Date startTime, @Param("endTime") Date endTime);
}
