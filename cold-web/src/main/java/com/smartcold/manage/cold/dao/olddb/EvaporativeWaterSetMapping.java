package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.EvaporativeWaterSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EvaporativeWaterSetMapping {

	EvaporativeWaterSetEntity findById(@Param("id") int id);

	List<EvaporativeWaterSetEntity> findByGroupid(@Param("groupid") int groupid);
}
