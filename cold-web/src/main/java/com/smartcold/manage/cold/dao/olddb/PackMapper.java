package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.PackEntity;

public interface PackMapper {

	public List<PackEntity> findAll();
	
	public PackEntity findPackByName(@Param("name") String name);
}
