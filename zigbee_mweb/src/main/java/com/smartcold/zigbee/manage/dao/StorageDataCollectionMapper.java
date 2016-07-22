package com.smartcold.zigbee.manage.dao;

import java.util.List;

import com.smartcold.zigbee.manage.entity.StorageDataCollectionEntity;

public interface StorageDataCollectionMapper {

	void batchInsert(List<StorageDataCollectionEntity> batchEntity);
}
