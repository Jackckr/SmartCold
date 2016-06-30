package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.SpiderCollectionConfigEntity;

public interface SpiderCollectionConfigMapper {

	public void addConfig(SpiderCollectionConfigEntity entity);

	public void updateConfig(SpiderCollectionConfigEntity entity);

	public SpiderCollectionConfigEntity findConfigByRdcid(int rdcid);
}
