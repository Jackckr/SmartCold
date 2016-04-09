package com.smartcold.zigbee.manage.entity;

import java.util.Date;

public class DataCollectionEntity {

	private long id;

	private String devID;

	private String apID;

	private long time;

	private float temperature;

	private Date addtime;

	public DataCollectionEntity(String devID, String apID, long time, float temperature) {
		this.devID = devID;
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

	public String getDevID() {
		return devID;
	}

	public void setDevID(String devID) {
		this.devID = devID;
	}

	public String getApID() {
		return apID;
	}

	public void setApID(String apID) {
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
