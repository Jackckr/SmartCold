package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class CompressorSetEntity {
	private int id;

	private int compressorgroupid;

	private String name;

	private int power;

	private float waterRatio;

	private int type;

	private String mapping;
	
	@DateTimeFormat(pattern="yyyy-mm-dd hh:ii:ss")
	private Date lastMaintainTime;//最后保养时间
	
	private double maintenancetime;//压缩机维护时间

	private Date addTime;

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

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}

	public Date getLastMaintainTime() {
		return lastMaintainTime;
	}

	public void setLastMaintainTime(Date lastMaintainTime) {
		this.lastMaintainTime = lastMaintainTime;
	}

	public double getMaintenancetime() {
		return maintenancetime;
	}

	public void setMaintenancetime(double maintenancetime) {
		this.maintenancetime = maintenancetime;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

}
