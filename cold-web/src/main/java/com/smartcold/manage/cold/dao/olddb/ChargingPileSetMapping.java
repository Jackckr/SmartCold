package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.ChargingPileSetEntity;

public interface ChargingPileSetMapping {

	ChargingPileSetEntity findById(@Param("id") int id);

	List<ChargingPileSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
