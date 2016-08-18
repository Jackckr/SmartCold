package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.PowerSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PowerSetMapping {

	PowerSetEntity findById(@Param("id") int id);

	List<PowerSetEntity> findByRdcId(@Param("rdcId") int rdcId);
}
