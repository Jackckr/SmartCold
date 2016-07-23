package com.smartcold.zigbee.manage.entity;

import java.util.Date;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-28 20:18)
 */
public class CommentEntity {
	private int id;

	private int rdcID;

	private int commerID;

	private String content;

	private float grade;

	private float locationGrade;

	private float facilityGrade;

	private float serviceGrade;

	private float sanitaryGrade;

	private String piclocation;

	private Date addTime;

	private int usefulcnt;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getRdcID() {
		return rdcID;
	}

	public void setRdcID(int rdcID) {
		this.rdcID = rdcID;
	}

	public int getCommerID() {
		return commerID;
	}

	public void setCommerID(int commerID) {
		this.commerID = commerID;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public float getGrade() {
		return grade;
	}

	public void setGrade(float grade) {
		this.grade = grade;
	}

	public float getLocationGrade() {
		return locationGrade;
	}

	public void setLocationGrade(float locationGrade) {
		this.locationGrade = locationGrade;
	}

	public float getFacilityGrade() {
		return facilityGrade;
	}

	public void setFacilityGrade(float facilityGrade) {
		this.facilityGrade = facilityGrade;
	}

	public float getServiceGrade() {
		return serviceGrade;
	}

	public void setServiceGrade(float serviceGrade) {
		this.serviceGrade = serviceGrade;
	}

	public float getSanitaryGrade() {
		return sanitaryGrade;
	}

	public void setSanitaryGrade(float sanitaryGrade) {
		this.sanitaryGrade = sanitaryGrade;
	}

	public String getPiclocation() {
		return piclocation;
	}

	public void setPiclocation(String piclocation) {
		this.piclocation = piclocation;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

	public int getUsefulcnt() {
		return usefulcnt;
	}

	public void setUsefulcnt(int usefulcnt) {
		this.usefulcnt = usefulcnt;
	}
}
