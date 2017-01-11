package com.smartcold.manage.cold.service;

import java.util.Date;

import com.smartcold.manage.cold.dto.OtherDeviceDto;

public interface OtherDeviceService {

	public OtherDeviceDto getOtherDeviceCostByTime(int rdcId, Date startTime, Date endTime);
}
