package com.smartcold.zigbee.manage.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 16:22)
 */
public class CommentDTO {

	private int id;

	private int rdcID;

	private int commerID;

	private String content;

	private String addTime;

	private String commerName;

	private float grade;

	private float locationGrade;

	private float facilityGrade;

	private float serviceGrade;

	private float sanitaryGrade;

//	private List<MultipartFile> files;

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

	public String getAddTime() {
		return addTime;
	}

	public void setAddTime(String addTime) {
		this.addTime = addTime;
	}

	public String getCommerName() {
		return commerName;
	}

	public void setCommerName(String commerName) {
		this.commerName = commerName;
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

//	public List<MultipartFile> getFiles() {
//		return files;
//	}
//
//	public void setFiles(List<MultipartFile> files) {
//		this.files = files;
//	}
}
