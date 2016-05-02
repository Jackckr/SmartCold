package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.ColdStorageDoorEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 10:16)
 */
public interface ColdStorageDoorMapper {
    List<ColdStorageDoorEntity> findLastNPoint(@Param("coldStorageDoorId") int storageID, @Param("npoint") int npoint);
}
