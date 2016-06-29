package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.StorageTypeEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:34)
 */
public interface StorageTypeMapper {

    List<StorageTypeEntity> findAll();
    
}
