package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.ForkLiftSetEntity;

public interface ForkLiftSetMapping {

	ForkLiftSetEntity findById(@Param("id") int id);

	List<ForkLiftSetEntity> findByRdcId(@Param("rdcId") int rdcId);
	
}
