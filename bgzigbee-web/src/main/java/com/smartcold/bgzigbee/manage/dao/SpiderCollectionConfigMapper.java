package com.smartcold.bgzigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.SpiderCollectionConfigEntity;

public interface SpiderCollectionConfigMapper {

	public void addConfig(SpiderCollectionConfigEntity entity);

	public void updateConfig(SpiderCollectionConfigEntity entity);

	public void deleteConfig(@Param("rdcid") int rdcid);

	public SpiderCollectionConfigEntity findConfigByRdcid(int rdcid);
}
