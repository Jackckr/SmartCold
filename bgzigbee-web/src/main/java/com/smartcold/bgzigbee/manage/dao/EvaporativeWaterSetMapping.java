package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.EvaporativeWaterSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EvaporativeWaterSetMapping {

	EvaporativeWaterSetEntity findById(@Param("id") int id);

	List<EvaporativeWaterSetEntity> findByGroupid(@Param("groupid") int groupid);

	boolean insert(EvaporativeWaterSetEntity evaporativeWaterSetEntity);
}
