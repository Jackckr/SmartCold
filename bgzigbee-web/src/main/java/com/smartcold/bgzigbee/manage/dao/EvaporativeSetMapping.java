package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.EvaporativeSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EvaporativeSetMapping {

	EvaporativeSetEntity findById(@Param("id") int id);

	List<EvaporativeSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	boolean insert(EvaporativeSetEntity evaporativeSetEntity);
}
