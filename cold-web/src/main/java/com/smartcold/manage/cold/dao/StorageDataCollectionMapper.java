package com.smartcold.manage.cold.dao;

import java.util.List;

import com.smartcold.manage.cold.entity.StorageDataCollectionEntity;

public interface StorageDataCollectionMapper {

	void batchInsert(List<StorageDataCollectionEntity> batchEntity);
}
