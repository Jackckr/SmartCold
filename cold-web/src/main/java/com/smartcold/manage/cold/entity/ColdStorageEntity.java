package com.smartcold.manage.cold.entity;

import java.util.Date;

public class ColdStorageEntity {

	private int id;

	private int storageID;

	private float Temperature;

	private float defrostingTemperature;

	private int refrigerationTime;

	private int coldFan;

	private int refrigerationValve;

	private int defrosting;

	private int warmValve;

	private int returnAirValue;

	private int startSwitch;

	private int doorSwitch;

	private int lightSwitch;

	private int overloadProtected;

	private int fanStatus;

	private Date addTime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getStorageID() {
		return storageID;
	}

	public void setStorageID(int storageID) {
		this.storageID = storageID;
	}

	public float getTemperature() {
		return Temperature;
	}

	public void setTemperature(float temperature) {
		Temperature = temperature;
	}

	public float getDefrostingTemperature() {
		return defrostingTemperature;
	}

	public void setDefrostingTemperature(float defrostingTemperature) {
		this.defrostingTemperature = defrostingTemperature;
	}

	public int getRefrigerationTime() {
		return refrigerationTime;
	}

	public void setRefrigerationTime(int refrigerationTime) {
		this.refrigerationTime = refrigerationTime;
	}

	public int getColdFan() {
		return coldFan;
	}

	public void setColdFan(int coldFan) {
		this.coldFan = coldFan;
	}

	public int getRefrigerationValve() {
		return refrigerationValve;
	}

	public void setRefrigerationValve(int refrigerationValve) {
		this.refrigerationValve = refrigerationValve;
	}

	public int getDefrosting() {
		return defrosting;
	}

	public void setDefrosting(int defrosting) {
		this.defrosting = defrosting;
	}

	public int getWarmValve() {
		return warmValve;
	}

	public void setWarmValve(int warmValve) {
		this.warmValve = warmValve;
	}

	public int getReturnAirValue() {
		return returnAirValue;
	}

	public void setReturnAirValue(int returnAirValue) {
		this.returnAirValue = returnAirValue;
	}

	public int getStartSwitch() {
		return startSwitch;
	}

	public void setStartSwitch(int startSwitch) {
		this.startSwitch = startSwitch;
	}

	public int getDoorSwitch() {
		return doorSwitch;
	}

	public void setDoorSwitch(int doorSwitch) {
		this.doorSwitch = doorSwitch;
	}

	public int getLightSwitch() {
		return lightSwitch;
	}

	public void setLightSwitch(int lightSwitch) {
		this.lightSwitch = lightSwitch;
	}

	public int getOverloadProtected() {
		return overloadProtected;
	}

	public void setOverloadProtected(int overloadProtected) {
		this.overloadProtected = overloadProtected;
	}

	public int getFanStatus() {
		return fanStatus;
	}

	public void setFanStatus(int fanStatus) {
		this.fanStatus = fanStatus;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
