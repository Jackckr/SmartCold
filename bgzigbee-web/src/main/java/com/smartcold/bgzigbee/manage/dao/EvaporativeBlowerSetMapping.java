package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.EvaporativeBlowerSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EvaporativeBlowerSetMapping {

	EvaporativeBlowerSetEntity findById(@Param("id") int id);

	List<EvaporativeBlowerSetEntity> findByGroupid(@Param("groupid") int groupid);

	boolean insert(EvaporativeBlowerSetEntity evaporativeBlowerSetEntity);
}
