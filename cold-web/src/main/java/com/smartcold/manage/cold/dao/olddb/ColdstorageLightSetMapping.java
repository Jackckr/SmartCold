package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.ColdStorageLightSetEntity;
import com.smartcold.manage.cold.entity.olddb.TempSetEntity;

public interface ColdstorageLightSetMapping {

	ColdStorageLightSetEntity findById(@Param("id") int id);

	List<ColdStorageLightSetEntity> findByRdcId(@Param("rdcId") int rdcId);
	
	int updateSet(ColdStorageLightSetEntity lightSetEntity);
	
	public List<TempSetEntity>  findByColdStorageId(@Param("coldstorageid") int coldstorageid);
}
