package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.olddb.ColdStorageDoorEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageDoorSetEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 10:37)
 */
public interface ColdStorageDoorService {
	List<ColdStorageDoorSetEntity> findByStorageId(int storageID);

	List<ColdStorageDoorEntity> findOpenTimeByStorageId(int storageID, Date startTime, Date endTime);

	List<ColdStorageDoorEntity> findOpenTimesByStorageId(int storageID, Date startTime, Date endTime);

}
