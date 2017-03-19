package com.smartcold.manage.cold.entity.comm;

import java.util.Date;

/**
 * 基类信息
 * 
 * @author Administrator
 * 
 */
public class ItemObject {
	
	private int id;
	private int rdcid;
	private int isRunning;
	private int coldStorageId;
	private String name;
	private double power;
	private String mapping;
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
	public double getPower() {
		return power;
	}
	public void setPower(double power) {
		this.power = power;
	}
	
	public int getIsRunning() {
		return isRunning;
	}
	public void setIsRunning(int isRunning) {
		this.isRunning = isRunning;
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
  
	
	public int getColdStorageId() {
		return coldStorageId;
	}
	public void setColdStorageId(int coldStorageId) {
		this.coldStorageId = coldStorageId;
	}
}
