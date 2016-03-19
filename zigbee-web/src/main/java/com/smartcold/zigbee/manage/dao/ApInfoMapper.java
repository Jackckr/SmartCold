package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.zigbee.manage.entity.ScdeviceEntity;

public interface ScdeviceMapper {

	public List<ScdeviceEntity> findInfoByGroupid(@Param("groupid") int groupid);
}
