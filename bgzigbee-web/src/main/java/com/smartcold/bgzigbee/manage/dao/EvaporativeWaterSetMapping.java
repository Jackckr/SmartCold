package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.EvaporativeWaterSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EvaporativeWaterSetMapping {

	EvaporativeWaterSetEntity findById(@Param("id") int id);

	List<EvaporativeWaterSetEntity> findByEvaporativeId(@Param("evaporativeid") int evaporativeId);

	boolean insert(EvaporativeWaterSetEntity evaporativeWaterSetEntity);
}
