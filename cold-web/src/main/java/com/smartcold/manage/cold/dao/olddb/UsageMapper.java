package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import com.smartcold.manage.cold.entity.olddb.UsageEntity;

public interface UsageMapper {
	
	List<UsageEntity> findAll();

}
