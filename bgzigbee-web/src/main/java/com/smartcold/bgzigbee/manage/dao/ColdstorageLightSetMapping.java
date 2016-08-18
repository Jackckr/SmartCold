package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.ColdStorageLightSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ColdstorageLightSetMapping {

	ColdStorageLightSetEntity findById(@Param("id") int id);

	List<ColdStorageLightSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	boolean insert(ColdStorageLightSetEntity coldStorageLightSetEntity);
}
