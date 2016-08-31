package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.PlatformDoorSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PlatformDoorSetMapping {

	PlatformDoorSetEntity findById(@Param("id") int id);

	List<PlatformDoorSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	boolean insert(PlatformDoorSetEntity platformDoorSetEntity);

	boolean updateById(PlatformDoorSetEntity entity);

}
