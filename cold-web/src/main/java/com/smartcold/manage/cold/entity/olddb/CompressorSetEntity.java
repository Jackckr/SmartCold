package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

public class CompressorSetEntity {
	private int id;

	private int compressorgroupid;

	private String name;

	private int power;

	private String mapping;

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

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

}
