package com.smartcold.manage.cold.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.PackEntity;

public interface PackMapper {

	public List<PackEntity> findAll();
	
	public PackEntity findPackByName(@Param("name") String name);
}
