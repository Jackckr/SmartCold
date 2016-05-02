package com.smartcold.manage.cold.service.impl;

import com.smartcold.manage.cold.dao.ColdStorageDoorMapper;
import com.smartcold.manage.cold.dao.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.entity.ColdStorageDoorEntity;
import com.smartcold.manage.cold.entity.ColdStorageDoorSetEntity;
import com.smartcold.manage.cold.service.ColdStorageDoorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 10:38)
 */
@Service
public class ColdStorageDoorServiceImpl implements ColdStorageDoorService {

    @Autowired
    private ColdStorageDoorMapper coldStorageDoorDao;

    @Autowired
    private ColdStorageDoorSetMapper coldStorageDoorSetDao;

    @Override
    public List<ColdStorageDoorEntity> findByStorageId(int storageID, int npoint) {
        List<ColdStorageDoorSetEntity> setList = coldStorageDoorSetDao.findLastNPoint(storageID, 1);
        int doorId = setList.get(0).getId();
        List<ColdStorageDoorEntity> results = coldStorageDoorDao.findLastNPoint(doorId, npoint);
        return results;
    }
}
