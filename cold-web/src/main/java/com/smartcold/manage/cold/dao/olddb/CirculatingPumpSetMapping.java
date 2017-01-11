package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.CirculatingPumpSetEntity;

public interface CirculatingPumpSetMapping {

	CirculatingPumpSetEntity findById(@Param("id") int id);

	List<CirculatingPumpSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
