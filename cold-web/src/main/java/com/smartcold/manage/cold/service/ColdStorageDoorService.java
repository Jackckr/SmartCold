package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.ColdStorageDoorEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 10:37)
 */
public interface ColdStorageDoorService {
	List<ColdStorageDoorEntity> findByStorageId(int storageID, int npoint);

	List<ColdStorageDoorEntity> findOpenTimeByStorageId(int storageID, Date startTime, Date endTime);

	List<ColdStorageDoorEntity> findOpenTimesByStorageId(int storageID, Date startTime, Date endTime);
}
