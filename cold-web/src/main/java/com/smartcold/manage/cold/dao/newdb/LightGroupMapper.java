package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemObject;

public interface LightGroupMapper {
	
	public List<ItemObject> getLightSetByRdcId(@Param("rdcId") int rdcId);
	
    public List<ItemObject> getLightSetByColdStorageId(@Param("coldStorageId") int coldStorageId);
}
