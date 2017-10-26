package com.smartcold.manage.cold.entity.comm;

import java.io.Serializable;
import java.util.Date;

/**
 * 配置基类信息
 * 
 * @author Administrator
 * 
 */
public class ItemConf implements Serializable {
	private int id;
	private int rdcid;
	private String name;
	private String devid;
	private double power;
	private String mapping;
	private Date addTime;
	private static final long serialVersionUID = -6729909449392408307L;
	
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
	public String getDevid() {
		return devid;
	}
	public void setDevid(String devid) {
		this.devid = devid;
	}
	public double getPower() {
		return power;
	}
	public void setPower(double power) {
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
