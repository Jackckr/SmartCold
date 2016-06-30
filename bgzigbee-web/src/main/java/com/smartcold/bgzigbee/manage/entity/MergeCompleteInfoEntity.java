package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class MergeCompleteInfoEntity {

	private String key;

	private String deviceid;

	private String apid;

	private Date startTime;

	private Date endTime;

	private float highestTemperature;

	private float lowestTemperature;

	private String location;

	public MergeCompleteInfoEntity(CompleteInfoEntity completeInfoEntity) {
		this.key = completeInfoEntity.getKey();
		this.deviceid = completeInfoEntity.getDeviceid();
		this.apid = completeInfoEntity.getApid();
		this.endTime = this.startTime = completeInfoEntity.getTime();
		this.lowestTemperature = this.highestTemperature = completeInfoEntity.getTemperature();
		this.location = completeInfoEntity.getLocation();
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(String deviceid) {
		this.deviceid = deviceid;
	}

	public String getApid() {
		return apid;
	}

	public void setApid(String apid) {
		this.apid = apid;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public float getHighestTemperature() {
		return highestTemperature;
	}

	public void setHighestTemperature(float highestTemperature) {
		this.highestTemperature = highestTemperature;
	}

	public float getLowestTemperature() {
		return lowestTemperature;
	}

	public void setLowestTemperature(float lowestTemperature) {
		this.lowestTemperature = lowestTemperature;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
}
