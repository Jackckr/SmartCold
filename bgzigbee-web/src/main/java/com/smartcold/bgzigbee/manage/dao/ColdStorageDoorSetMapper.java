package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.ColdStorageDoorSetEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 10:30)
 */
public interface ColdStorageDoorSetMapper {
	List<ColdStorageDoorSetEntity> findDoorByStorageId(@Param("coldStorageId") int storageID);

	void updateMappingById(@Param("coldStorageDoorId") int coldStorageDoorId, @Param("mapping") String mapping);
	
	void insertDoor(ColdStorageDoorSetEntity entity);
}
