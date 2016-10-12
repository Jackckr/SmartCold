package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

public class PowerSetEntity {

	private int id;

	private String name;

	private float radio;

	private int rdcid;

	private String mapping;
	
	private double iunbalance;

	private Date addTime;

	public float getRadio() {
		return radio;
	}

	public void setRadio(float radio) {
		this.radio = radio;
	}

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

	public double getIunbalance() {
		return iunbalance;
	}

	public void setIunbalance(double iunbalance) {
		this.iunbalance = iunbalance;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
