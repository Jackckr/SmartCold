package com.smartcold.zigbee.manage.dto;

import java.util.List;

import com.smartcold.zigbee.manage.entity.FileDataEntity;

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
	
	private  String nickname;

	private float grade;

	private float locationGrade;

	private float facilityGrade;

	private float serviceGrade;

	private float sanitaryGrade;
	
	private String avatar="app/img/userimg.jpg";//用户头像->add
	
	private List<FileDataEntity> reviewPics;

	private int usefulcnt;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public List<FileDataEntity> getReviewPics() {
		return reviewPics;
	}

	public void setReviewPics(List<FileDataEntity> reviewPics) {
		this.reviewPics = reviewPics;
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

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public float getSanitaryGrade() {
		return sanitaryGrade;
	}

	public void setSanitaryGrade(float sanitaryGrade) {
		this.sanitaryGrade = sanitaryGrade;
	}

	public int getUsefulcnt() {
		return usefulcnt;
	}

	public void setUsefulcnt(int usefulcnt) {
		this.usefulcnt = usefulcnt;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}
	
}
