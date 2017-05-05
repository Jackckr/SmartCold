package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
/**
 * 设备状态信息
 * @author Administrator
 *
 */
public interface DevStatusMapper {
	
    public Integer getPLByDEVName(@Param("name")String name,@Param("type")Integer type);
	
	public void addAPStatusList(List<StorageDataCollectionEntity> batchEntity);
	
	public void addDevStatusList(List<StorageDataCollectionEntity> batchEntity);
	
	

	
}
