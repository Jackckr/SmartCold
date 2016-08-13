package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;

public interface PowerSetMapping {

	PowerSetEntity findById(@Param("id") int id);

	List<PowerSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
