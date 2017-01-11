package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.PressurePlatformSetEntity;

public interface PressurePlatformSetMapping {

	PressurePlatformSetEntity findById(@Param("id") int id);

	List<PressurePlatformSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
