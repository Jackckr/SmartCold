package com.smartcold.manage.cold.dto;

import java.util.Date;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-03 00:16)
 */
public class BlowerDTO {

	private int blowerId;

	private int compressorGroupId;

	private int coldStorageId;

	private float defrostingTemperature;

	private String coldStorageName;

	private Date startTime;

	private int state;

	private Date addTime;

	private int isRunning;

	private int isDefrosting;

	private int runTime;

	private int defrostTime;

	public int getBlowerId() {
		return blowerId;
	}

	public void setBlowerId(int blowerId) {
		this.blowerId = blowerId;
	}

	public int getCompressorGroupId() {
		return compressorGroupId;
	}

	public void setCompressorGroupId(int compressorGroupId) {
		this.compressorGroupId = compressorGroupId;
	}

	public int getColdStorageId() {
		return coldStorageId;
	}

	public void setColdStorageId(int coldStorageId) {
		this.coldStorageId = coldStorageId;
	}

	public float getDefrostingTemperature() {
		return defrostingTemperature;
	}

	public void setDefrostingTemperature(float defrostingTemperature) {
		this.defrostingTemperature = defrostingTemperature;
	}

	public String getColdStorageName() {
		return coldStorageName;
	}

	public void setColdStorageName(String coldStorageName) {
		this.coldStorageName = coldStorageName;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

	public int getIsRunning() {
		return isRunning;
	}

	public void setIsRunning(int isRunning) {
		this.isRunning = isRunning;
	}

	public int getIsDefrosting() {
		return isDefrosting;
	}

	public void setIsDefrosting(int isDefrosting) {
		this.isDefrosting = isDefrosting;
	}

	public int getRunTime() {
		return runTime;
	}

	public void setRunTime(int runTime) {
		this.runTime = runTime;
	}

	public int getDefrostTime() {
		return defrostTime;
	}

	public void setDefrostTime(int defrostTime) {
		this.defrostTime = defrostTime;
	}
}
