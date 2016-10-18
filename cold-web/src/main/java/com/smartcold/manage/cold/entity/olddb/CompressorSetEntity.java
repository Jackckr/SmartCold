package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

public class CompressorSetEntity {
	private int id;

	private int compressorgroupid;

	private String name;

	private int power;

	private float waterRatio;

	private int type;

	private float highTemp;

	private float lowTemp;

	private String mapping;

	private Date maintenancetime;//压缩机维护时间
	
	private Date addTime;

	public float getHighTemp() {
		return highTemp;
	}

	public void setHighTemp(float highTemp) {
		this.highTemp = highTemp;
	}

	public float getLowTemp() {
		return lowTemp;
	}

	public void setLowTemp(float lowTemp) {
		this.lowTemp = lowTemp;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getCompressorgroupid() {
		return compressorgroupid;
	}

	public void setCompressorgroupid(int compressorgroupid) {
		this.compressorgroupid = compressorgroupid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getPower() {
		return power;
	}

	public void setPower(int power) {
		this.power = power;
	}

	public float getWaterRatio() {
		return waterRatio;
	}

	public void setWaterRatio(float waterRatio) {
		this.waterRatio = waterRatio;
	}

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}

	public Date getMaintenancetime() {
		return maintenancetime;
	}

	public void setMaintenancetime(Date maintenancetime) {
		this.maintenancetime = maintenancetime;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

}
