package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

public class ForkLiftSetEntity {

	private int id;
	  
	private String name;
	  
	private int rdcid;
	  
	private String mapping;
	  
	private Date addTime;
	
	private double power;

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

	public int getRdcid() {
		return rdcid;
	}

	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
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

	public double getPower() {
		return power;
	}

	public void setPower(double power) {
		this.power = power;
	}
}
