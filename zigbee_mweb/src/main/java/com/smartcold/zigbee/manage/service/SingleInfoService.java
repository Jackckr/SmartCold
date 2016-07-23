package com.smartcold.zigbee.manage.service;

import java.util.List;

import com.smartcold.zigbee.manage.dto.SingleInfoEntity;

public interface SingleInfoService {

	public SingleInfoEntity getAllInfoByKey(String key);
	
	public List<SingleInfoEntity> getBatchInfoByKey(String key);
	
}
