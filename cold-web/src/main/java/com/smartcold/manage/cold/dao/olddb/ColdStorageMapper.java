package com.smartcold.manage.cold.dao.olddb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.ColdStorageEntity;

public interface ColdStorageMapper {

	public List<ColdStorageEntity> findLastNPoint(@Param("storageID") int storageID, @Param("npoint") int npoint);

	public List<ColdStorageEntity> findPoitByTime(@Param("storageID") int storageID, @Param("begin") Date begin,
			@Param("end") Date end);

	public List<ColdStorageEntity> findNewInsertColdStorages();
}
