package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.PressurePlatformSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PressurePlatformSetMapping {

	PressurePlatformSetEntity findById(@Param("id") int id);

	List<PressurePlatformSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
