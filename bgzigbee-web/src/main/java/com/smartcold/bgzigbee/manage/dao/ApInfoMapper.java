package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.ApInfoEntity;

public interface ApInfoMapper {

	public List<ApInfoEntity> findInfoByfindInfoByApid(@Param("apid") String apid);
}
