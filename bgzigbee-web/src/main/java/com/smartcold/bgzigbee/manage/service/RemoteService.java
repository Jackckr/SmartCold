package com.smartcold.bgzigbee.manage.service;

public interface RemoteService {
	public Object saveStorageKeys(int type,String key, String desc, String unit);
	
	public Object delStorageKey(int id);
}
