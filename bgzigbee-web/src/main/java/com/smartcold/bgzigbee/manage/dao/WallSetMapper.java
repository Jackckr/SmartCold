package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.WallSetEntity;

public interface WallSetMapper {

	public void insert(WallSetEntity entity);

	public void delete(@Param("id") int id);

	public void update(WallSetEntity entity);

	public List<WallSetEntity> findByStorageId(@Param("coldstorageid") int coldstorageid);
}
