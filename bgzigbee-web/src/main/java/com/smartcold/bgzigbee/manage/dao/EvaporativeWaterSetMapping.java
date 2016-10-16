package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.EvaporativeWaterSetEntity;

public interface EvaporativeWaterSetMapping {

	EvaporativeWaterSetEntity findById(@Param("id") int id);

	List<EvaporativeWaterSetEntity> findByEvaporativeId(@Param("evaporativeid") int evaporativeid);

	boolean insert(EvaporativeWaterSetEntity evaporativeWaterSetEntity);
}
