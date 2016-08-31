package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-01 23:23)
 */
public interface ColdStorageSetMapper {

    List<ColdStorageSetEntity> findLastNPoint(@Param("id") int id, @Param("npoint") int npoint);

    List<ColdStorageSetEntity> findByRdcId(@Param("rdcId") int rdcId);
    
    List<ColdStorageSetEntity> findAllColdStorage();
}
