package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.CompressorGroupSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 14:24)
 */
public interface CompressorGroupSetMapper {

	List<CompressorGroupSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	void updateMappingById(@Param("id") int id, @Param("mapping") String mapping);

	void insertCompressorGroup(CompressorGroupSetEntity entity);

	void deleteCompressorGroup(@Param("id") int id);

	boolean updateById(CompressorGroupSetEntity entity);
}
