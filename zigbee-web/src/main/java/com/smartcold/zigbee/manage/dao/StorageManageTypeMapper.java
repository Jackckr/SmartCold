package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.StorageManageTypeEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:51)
 */
public interface StorageManageTypeMapper {

    List<StorageManageTypeEntity> findAll();

    String getTypeById(int id);

}
