package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import com.smartcold.bgzigbee.manage.entity.SpiderItemConfigEntity;

public interface SpiderItemConfigMapper {

	public List<SpiderItemConfigEntity> findItemByType(int type);

	public void addItem(SpiderItemConfigEntity entity);
}
