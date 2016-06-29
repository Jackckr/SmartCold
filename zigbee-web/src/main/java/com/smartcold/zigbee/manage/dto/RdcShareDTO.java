package com.smartcold.zigbee.manage.dto;

import com.smartcold.zigbee.manage.service.FtpService;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: 库共享
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class RdcShareDTO {
	private int id; //
	private int rdcID; // 睿库的ID
	private int releaseID; // 发布者id
	private String title; // share_title->name发布标题 :关联显示发布时的标题
	private int typeCode; // rental_type:出租类型:1:出租 2:求租
	private String typeText; //
	private String unitPrice; // +出租单价
	private String unit; // 单位:元/天
	private String sqm; // 出租/求租->面积
	private String validStartTime; // +开始有效期
	private String validEndTime; // 结束有效期
	private int applyID; // 申请者ID
	private int bookings; // 申请量
	private int stauts; // 当前消息是否有效 0：无效 1：有效
	private String addtime; // 添加时间
	private String updatetime; // 最后更新时间
	
	private String name;
	private String address;
	private String coldtype;
	private String logo="app/img/rdcHeader.jpg";

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

	public int getReleaseID() {
		return releaseID;
	}

	public void setReleaseID(int releaseID) {
		this.releaseID = releaseID;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(int typeCode) {
		this.typeCode = typeCode;
	}

	public String getTypeText() {
		return typeText;
	}

	public void setTypeText(String typeText) {
		this.typeText = typeText;
	}

	public String getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(String unitPrice) {
		this.unitPrice = unitPrice;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getSqm() {
		return sqm;
	}

	public void setSqm(String sqm) {
		this.sqm = sqm;
	}

	public String getValidStartTime() {
		return validStartTime;
	}

	public void setValidStartTime(String validStartTime) {
		this.validStartTime = validStartTime;
	}

	public String getValidEndTime() {
		return validEndTime;
	}

	public void setValidEndTime(String validEndTime) {
		this.validEndTime = validEndTime;
	}

	public int getApplyID() {
		return applyID;
	}

	public void setApplyID(int applyID) {
		this.applyID = applyID;
	}

	public int getBookings() {
		return bookings;
	}

	public void setBookings(int bookings) {
		this.bookings = bookings;
	}

	public int getStauts() {
		return stauts;
	}

	public void setStauts(int stauts) {
		this.stauts = stauts;
	}

	public String getAddtime() {
		return addtime;
	}

	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}

	public String getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = FtpService.READ_URL+ logo;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getColdtype() {
		return coldtype;
	}

	public void setColdtype(String coldtype) {
		this.coldtype = coldtype;
	}

	
}