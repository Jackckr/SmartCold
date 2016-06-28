package com.smartcold.bgzigbee.manage.service;

import java.util.List;

import com.smartcold.bgzigbee.manage.dto.SingleInfoEntity;

public interface SingleInfoService {

	public SingleInfoEntity getAllInfoByKey(String key);
	
	public List<SingleInfoEntity> getBatchInfoByKey(String key);
	
}
