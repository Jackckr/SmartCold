package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class PowerSetEntity {
	private int id;
	private int rdcid;
	private String name;
	private String mapping;
	private Double iunbalance;
	private Date addTime;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMapping() {
		return mapping;
	}
	public void setMapping(String mapping) {
		this.mapping = mapping;
	}
	public Double getIunbalance() {
		return iunbalance;
	}
	public void setIunbalance(Double iunbalance) {
		this.iunbalance = iunbalance;
	}
	public Date getAddTime() {
		return addTime;
	}
	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}


	
}
