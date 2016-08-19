package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 11:52)
 */
public class ColdStorageLightSetEntity {

	private int id;
	  
	private int rdcid;

	private String name;
	  
	private float power;
	  
	private String mapping;
	  
	private Date addTime;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getRdcid() {
		return rdcid;
	}

	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
	}

	public float getPower() {
		return power;
	}

	public void setPower(float power) {
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
