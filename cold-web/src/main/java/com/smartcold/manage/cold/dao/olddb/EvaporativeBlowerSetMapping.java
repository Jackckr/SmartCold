package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.EvaporativeBlowerSetEntity;

public interface EvaporativeBlowerSetMapping {

	EvaporativeBlowerSetEntity findById(@Param("id") int id);

	List<EvaporativeBlowerSetEntity> findByEvaporativeId(@Param("evaporativeId") int evaporativeId);
}
