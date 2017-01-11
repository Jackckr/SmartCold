package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-03-19 16:28)
 */
public class CompressorGroupSetEntity {

	private int id;

	private String name;

	private int groupId;

	private int rdcId;

	private float lowPress;

	private float pressDiff;

	private float meltFrostTemperature;

	private Date addTime;

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

	public int getGroupId() {
		return groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public int getRdcId() {
		return rdcId;
	}

	public void setRdcId(int rdcId) {
		this.rdcId = rdcId;
	}

	public float getLowPress() {
		return lowPress;
	}

	public void setLowPress(float lowPress) {
		this.lowPress = lowPress;
	}

	public float getPressDiff() {
		return pressDiff;
	}

	public void setPressDiff(float pressDiff) {
		this.pressDiff = pressDiff;
	}

	public float getMeltFrostTemperature() {
		return meltFrostTemperature;
	}

	public void setMeltFrostTemperature(float meltFrostTemperature) {
		this.meltFrostTemperature = meltFrostTemperature;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
