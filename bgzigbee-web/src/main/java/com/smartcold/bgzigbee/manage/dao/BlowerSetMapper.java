package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.BlowerSetEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 23:31)
 */
public interface BlowerSetMapper {

	void insertBlower(BlowerSetEntity entity);
	
	void updateBlower(BlowerSetEntity entity);

	void deleteBlower(@Param("id") int id);
	
	List<BlowerSetEntity> findByStorageId(int coldStorageId);
	
	void updateMappingById(@Param("id") int id, @Param("mapping") String mapping);
}
