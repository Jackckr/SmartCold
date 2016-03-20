package com.smartcold.zigbee.manage.entity;

import java.util.Date;

public class DataCollectionEntity {

	private long id;

	private String deviceID;

	private String apID;

	private long time;

	private float temperature;

	private Date addtime;

	public DataCollectionEntity(String deviceID, String apID, long time, float temperature) {
		this.deviceID = deviceID;
		this.apID = apID;
		this.time = time;
		this.temperature = temperature;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getdeviceID() {
		return deviceID;
	}

	public void setdeviceID(String deviceID) {
		this.deviceID = deviceID;
	}

	public String getapID() {
		return apID;
	}

	public void setapID(String apID) {
		this.apID = apID;
	}

	public Date getTime() {
		return new Date(time * 1000);
	}

	public void setTime(long time) {
		this.time = time;
	}

	public float getTemperature() {
		return temperature;
	}

	public void setTemperature(float temperature) {
		this.temperature = temperature;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}
}
