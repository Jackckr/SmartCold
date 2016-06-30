package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import com.smartcold.bgzigbee.manage.entity.StorageTypeEntity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:34)
 */
public interface StorageTypeMapper {

    List<StorageTypeEntity> findAll();
    
}
