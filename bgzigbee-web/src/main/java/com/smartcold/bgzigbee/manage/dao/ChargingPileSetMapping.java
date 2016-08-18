package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.ChargingPileSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ChargingPileSetMapping {

	ChargingPileSetEntity findById(@Param("id") int id);

	List<ChargingPileSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
