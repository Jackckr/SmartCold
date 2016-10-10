package com.smartcold.bgzigbee.manage.entity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-03-19 11:53)
 */
public class BlowerSetEntity {

	private int id;

	private String name;

	private int blowerId;

	private int compressorGroupId;

	private int coldStorageId;

	private float defrostingTemperature;

	private String mapping;
	
	private double power;//总机功率 备用
	    
	private double fanPower;//冷风机功率
	    
	private double frostPower;//化霜功率

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

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

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}

	public double getPower() {
		return power;
	}

	public void setPower(double power) {
		this.power = power;
	}

	public double getFanPower() {
		return fanPower;
	}

	public void setFanPower(double fanPower) {
		this.fanPower = fanPower;
	}

	public double getFrostPower() {
		return frostPower;
	}

	public void setFrostPower(double frostPower) {
		this.frostPower = frostPower;
	}
	
	
}
