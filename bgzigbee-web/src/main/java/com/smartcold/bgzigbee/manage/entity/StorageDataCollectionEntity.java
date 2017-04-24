package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class StorageDataCollectionEntity {

	private int id;

	private String deviceid;

	private String apid;

	private String key;

	private Object value;

	private String time;

	private String addtime;

	public StorageDataCollectionEntity() {

	}

	public StorageDataCollectionEntity(String apid, String deviceid, String key, Object value, String time) {
		this.apid = apid;
		this.deviceid = deviceid;
		this.key = key;
		this.value = value;
		this.time = time;
	}

	public String getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(String deviceid) {
		this.deviceid = deviceid;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getApid() {
		return apid;
	}

	public void setApid(String apid) {
		this.apid = apid;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getAddtime() {
		return addtime;
	}

	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}

	
}
