package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.EvaporativeBlowerSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EvaporativeBlowerSetMapping {

	EvaporativeBlowerSetEntity findById(@Param("id") int id);

	List<EvaporativeBlowerSetEntity> findByGroupid(@Param("groupid") int groupid);
}
