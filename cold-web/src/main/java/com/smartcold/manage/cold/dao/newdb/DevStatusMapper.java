package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
/**
 * 设备状态信息
 * @author Administrator
 *
 */
public interface DevStatusMapper {

	void addDataList(List<StorageDataCollectionEntity> batchEntity);

	
}
