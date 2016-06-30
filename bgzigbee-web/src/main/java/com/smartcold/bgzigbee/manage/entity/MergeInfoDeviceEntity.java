package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class MergeInfoDeviceEntity {

	private String location;
	
	private Date startTime;
	
	private Date endTime;
	
	private float lowestTemperature;
	
	private float highestTemperature;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
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

	public float getLowestTemperature() {
		return lowestTemperature;
	}

	public void setLowestTemperature(float lowestTemperature) {
		this.lowestTemperature = lowestTemperature;
	}

	public float getHighestTemperature() {
		return highestTemperature;
	}

	public void setHighestTemperature(float highestTemperature) {
		this.highestTemperature = highestTemperature;
	}
}
