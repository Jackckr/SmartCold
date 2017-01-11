package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;

import java.util.List;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 14:24)
 */
public interface CompressorGroupSetMapper {

	List<CompressorGroupSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	CompressorGroupSetEntity findById(@Param("id") int id);

}
