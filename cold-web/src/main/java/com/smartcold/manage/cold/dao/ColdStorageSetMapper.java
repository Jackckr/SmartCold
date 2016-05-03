package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.ColdStorageSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-01 23:23)
 */
public interface ColdStorageSetMapper {

    List<ColdStorageSetEntity> findLastNPoint(@Param("storageID") int storageID, @Param("npoint") int npoint);

    List<ColdStorageSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
