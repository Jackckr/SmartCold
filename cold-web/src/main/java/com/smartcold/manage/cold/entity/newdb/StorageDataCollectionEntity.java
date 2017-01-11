package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class StorageDataCollectionEntity {

	private int id;

	private String deviceid;

	private String apid;

	private String key;

	private String value;

	private Date time;

	private Date addtime;

	public StorageDataCollectionEntity() {

	}

	public StorageDataCollectionEntity(String apid, String deviceid, String key, String value, Date time) {
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

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}
}
