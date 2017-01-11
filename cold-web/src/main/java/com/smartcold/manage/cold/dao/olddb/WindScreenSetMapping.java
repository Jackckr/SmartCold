package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.WindScreenSetEntity;

public interface WindScreenSetMapping {

	WindScreenSetEntity findById(@Param("id") int id);

	List<WindScreenSetEntity> findByStorageId(@Param("storageid") int storageid);
}
