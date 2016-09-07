package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.StorageStructureTypeEntity;
import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:34)
 */
public interface StorageStructureTypeMapper {

    List<StorageStructureTypeEntity> findAll();
    
}
