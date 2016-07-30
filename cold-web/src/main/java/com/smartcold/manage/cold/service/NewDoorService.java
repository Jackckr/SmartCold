package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.List;

import com.smartcold.manage.cold.entity.StorageKeyValue;

public interface NewDoorService {
	List<StorageKeyValue> getDoorStatusByNums(Integer oid,Integer nums);
	
	List<StorageKeyValue> getDoorStatusByTime(Integer oid, Date startTime, Date endTime);
}
