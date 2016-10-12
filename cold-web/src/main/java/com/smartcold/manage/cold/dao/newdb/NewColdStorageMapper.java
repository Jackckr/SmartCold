package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.NewColdStorageEntity;

public interface NewColdStorageMapper {

	public List<NewColdStorageEntity> findIBlowerByTime(@Param("oid")int oid,  @Param("iunbalance")float iunbalance,@Param("delay")float delay, @Param("key")String key,@Param("startTime") Date startTime);
}
