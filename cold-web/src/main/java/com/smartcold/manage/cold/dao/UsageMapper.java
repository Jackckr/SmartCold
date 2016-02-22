package com.smartcold.manage.cold.dao;

import java.util.List;

import com.smartcold.manage.cold.entity.UsageEntity;

public interface UsageMapper {
	
	List<UsageEntity> findAll();

}
