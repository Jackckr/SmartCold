package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.CompleteInfoEntity;

public interface CompleteInfoMapper {

	public List<CompleteInfoEntity> findInfoByKey(@Param("key") String key);
}
