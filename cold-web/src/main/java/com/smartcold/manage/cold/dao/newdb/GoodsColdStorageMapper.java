package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.GoodsColdStorageEntity;

public interface GoodsColdStorageMapper {

	List<GoodsColdStorageEntity> findByDate(@Param("coldstorageId") int coldstorageId,
			@Param("startCollectionTime") Date startCollectionTime, @Param("endCollectionTime") Date endCollectionTime);
}
