package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class CompanyStaffEntity {

	private int id;

	private String staffNum;

	private Date addTime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getStaffNum() {
		return staffNum;
	}

	public void setStaffNum(String staffNum) {
		this.staffNum = staffNum;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
