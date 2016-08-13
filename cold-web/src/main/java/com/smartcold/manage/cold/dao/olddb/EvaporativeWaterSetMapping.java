package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.EvaporativeWaterSetEntity;

public interface EvaporativeWaterSetMapping {

	EvaporativeWaterSetEntity findById(@Param("id") int id);

	List<EvaporativeWaterSetEntity> findByEvaporativeId(@Param("evaporativeId") int evaporativeId);
}
