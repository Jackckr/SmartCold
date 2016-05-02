package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.entity.ColdStorageDoorEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 10:37)
 */
public interface ColdStorageDoorService {
    List<ColdStorageDoorEntity> findByStorageId(int storageID, int npoint);
}
