package com.smartcold.bgzigbee.manage.service.impl;

import com.smartcold.bgzigbee.manage.entity.DeviceObjectMappingEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.bgzigbee.manage.service.RemoteService;
import com.smartcold.bgzigbee.manage.service.base.HttpService;

@Service
public class RemoteServiceImpl implements RemoteService {
	
//	public final static String COLD_WEB_URL = "http://www.smartcold.org.cn/i/";
	public final static String COLD_WEB_URL = "http://localhost:8081/i/";

	@Autowired
	HttpService httpService;

	@Override
	public Object saveStorageKeys(int type, String key, String desc, String unit) {
		String params = String.format("type=%s&key=%s&desc=%s&unit=%s", type,key,desc,unit);
		return httpService.sendPost(COLD_WEB_URL+"storageKeys/saveStorageKeys", params);
	}

	@Override
	public Object delStorageKey(int id) {
		String params = String.format("id=%s", id);
		return httpService.sendPost(COLD_WEB_URL+"storageKeys/delStorageKey", params);
	}

	@Override
	public Object insertDeviceObjectMapping(DeviceObjectMappingEntity deviceObjectMappingEntity) {
		String params = String.format("deviceid=%s&type=%s&oid=%s", deviceObjectMappingEntity.getDeviceid(), deviceObjectMappingEntity.getType(), deviceObjectMappingEntity.getOid());
		return httpService.sendPost(COLD_WEB_URL+"deviceObjectMapping/add", params);
	}

	@Override
	public Object delDeviceObjectMappingById(int id) {
		String params = String.format("id=%s", id);
		return httpService.sendPost(COLD_WEB_URL+"deviceObjectMapping/del", params);
	}


}
