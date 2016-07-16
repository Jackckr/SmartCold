package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.ColdStorageSetEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-01 23:23)
 */
public interface ColdStorageSetMapper {

	List<ColdStorageSetEntity> findLastNPoint(@Param("storageID") int storageID, @Param("npoint") int npoint);

	List<ColdStorageSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	void updateMappingById(@Param("coldStorageId") int coldStorageId, @Param("mapping") String mapping);

	void insertColdStorage(ColdStorageSetEntity entity);
}
