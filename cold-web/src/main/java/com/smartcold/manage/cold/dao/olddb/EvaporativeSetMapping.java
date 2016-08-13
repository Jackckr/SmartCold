package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.EvaporativeSetEntity;

public interface EvaporativeSetMapping {

	EvaporativeSetEntity findByid(@Param("id") int id);

	List<EvaporativeSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
