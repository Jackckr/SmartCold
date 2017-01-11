package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.PackEntity;

public interface PackMapper {

	public List<PackEntity> findAll();
	
	public PackEntity findPackByName(@Param("name") String name);
}
