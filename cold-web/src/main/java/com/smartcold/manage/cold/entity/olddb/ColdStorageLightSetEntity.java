package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 11:52)
 */
public class ColdStorageLightSetEntity {

	private int id;
	  
	private int rdcid;
	  
	private float power;
	  
	private String mapping;
	
	private String name;
	  
	private Date addTime;
	
	private Integer positionX;
	
	private Integer positionY;
	
	private Integer rotate;
	

	public Integer getDiv_x() {
		return positionX;
	}

	public void setDiv_x(Integer div_x) {
		this.positionX = div_x;
	}

	public Integer getDiv_y() {
		return positionY;
	}

	public void setDiv_y(Integer div_y) {
		this.positionY = div_y;
	}

	public Integer getRotate() {
		return rotate;
	}

	public void setRotate(Integer rotate) {
		this.rotate = rotate;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
