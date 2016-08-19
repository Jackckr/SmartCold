package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.ForkLiftSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ForkLiftSetMapping {

	ForkLiftSetEntity findById(@Param("id") int id);

	List<ForkLiftSetEntity> findByRdcId(@Param("rdcId") int rdcId);

}
