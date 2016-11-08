package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.PressurePlatformSetEntity;

public interface PressurePlatformSetMapping {

	PressurePlatformSetEntity findById(@Param("id") int id);

	List<PressurePlatformSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	void update(PressurePlatformSetEntity entity);
}
