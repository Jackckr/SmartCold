package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.ApInfoEntity;

public interface ApInfoMapper {

	public List<ApInfoEntity> findInfoByfindInfoByApid(@Param("apid") String apid);
}
