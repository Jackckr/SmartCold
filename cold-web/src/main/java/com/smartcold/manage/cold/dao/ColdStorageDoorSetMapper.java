package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.ColdStorageDoorSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 10:30)
 */
public interface ColdStorageDoorSetMapper {
    List<ColdStorageDoorSetEntity> findLastNPoint(@Param("coldStorageId") int storageID, @Param("npoint") int npoint);
    
    List<ColdStorageDoorSetEntity> findByStorageId(int storageID);
    
    List<ColdStorageDoorSetEntity> findByRdcId(int rdcId);
}
