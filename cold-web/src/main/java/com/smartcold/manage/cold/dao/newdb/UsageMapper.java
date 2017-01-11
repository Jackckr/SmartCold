package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.UsageEntity;

public interface UsageMapper {
	
	List<UsageEntity> findAll();

}
