package com.smartcold.zigbee.manage.service;

import java.util.List;

import com.smartcold.zigbee.manage.entity.MergeInfoDeviceEntity;

public interface ScDeviceService {

	public List<MergeInfoDeviceEntity> findScDeviceByKey(String key);
}
