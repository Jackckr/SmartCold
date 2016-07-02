package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.StorageTemperTypeEntity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:38)
 */
public interface StorageTemperTypeMapper {

    List<StorageTemperTypeEntity> findAll();
    int addStorageTemperType(StorageTemperTypeEntity storageTemperType);
    void deleteStorageTemperType(@Param("id") int id);
}
