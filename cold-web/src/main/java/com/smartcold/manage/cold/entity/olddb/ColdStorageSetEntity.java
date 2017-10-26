package com.smartcold.manage.cold.entity.olddb;

import java.io.Serializable;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-03-19 16:25)
 */
public class ColdStorageSetEntity implements Serializable{

	private int id;

	private int coldStorageID;

	private int rdcId;

	private String name;

	private float startTemperature;

	private float energyCost;

	private Double longitude;

	private Double latitude;

	private String location;

	private float tempdiff;
	
	private float overtempalarm;
	
	private float overtempdelay;

	private String tids;//附加属性:温度id 
	private String deviceids;//附加属性
	private double baseTemp;//附加属性 :基准温度
	
	private static final long serialVersionUID = -7808658583346043792L;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getColdStorageID() {
		return coldStorageID;
	}
	public void setColdStorageID(int coldStorageID) {
		this.coldStorageID = coldStorageID;
	}
	public int getRdcId() {
		return rdcId;
	}
	public void setRdcId(int rdcId) {
		this.rdcId = rdcId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public float getStartTemperature() {
		return startTemperature;
	}
	public void setStartTemperature(float startTemperature) {
		this.startTemperature = startTemperature;
	}
	public float getEnergyCost() {
		return energyCost;
	}
	public void setEnergyCost(float energyCost) {
		this.energyCost = energyCost;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public float getTempdiff() {
		return tempdiff;
	}
	public void setTempdiff(float tempdiff) {
		this.tempdiff = tempdiff;
	}
	public float getOvertempalarm() {
		return overtempalarm;
	}
	public void setOvertempalarm(float overtempalarm) {
		this.overtempalarm = overtempalarm;
	}
	public float getOvertempdelay() {
		return overtempdelay;
	}
	public void setOvertempdelay(float overtempdelay) {
		this.overtempdelay = overtempdelay;
	}
	public String getTids() {
		return tids;
	}
	public void setTids(String tids) {
		this.tids = tids;
	}
	
	public String getDeviceids() {
		return deviceids;
	}
	public void setDeviceids(String deviceids) {
		this.deviceids = deviceids;
	}
	public double getBaseTemp() {
		return baseTemp;
	}
	public void setBaseTemp(double baseTemp) {
		this.baseTemp = baseTemp;
	}
	

	
}
