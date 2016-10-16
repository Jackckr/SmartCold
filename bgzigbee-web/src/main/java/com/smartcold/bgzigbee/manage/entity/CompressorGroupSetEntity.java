package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-03-19 16:28)
 */
public class CompressorGroupSetEntity {

	private int id;

	private String name;

	private int evaporativeid;

	private int rdcId;

	private float lowPress;

	private float pressDiff;

	private float meltFrostTemperature;

	private Date addTime;

	private String mapping;

	private float crashStopPress;

	private float highPressAlarm;

	private float highTempAlarm;

	private float lowTempAlarm;

	public float getCrashStopPress() {
		return crashStopPress;
	}

	public void setCrashStopPress(float crashStopPress) {
		this.crashStopPress = crashStopPress;
	}

	public float getHighPressAlarm() {
		return highPressAlarm;
	}

	public void setHighPressAlarm(float highPressAlarm) {
		this.highPressAlarm = highPressAlarm;
	}

	public float getHighTempAlarm() {
		return highTempAlarm;
	}

	public void setHighTempAlarm(float highTempAlarm) {
		this.highTempAlarm = highTempAlarm;
	}

	public float getLowTempAlarm() {
		return lowTempAlarm;
	}

	public void setLowTempAlarm(float lowTempAlarm) {
		this.lowTempAlarm = lowTempAlarm;
	}

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

	public int getEvaporativeid() {
		return evaporativeid;
	}

	public void setEvaporativeid(int evaporativeid) {
		this.evaporativeid = evaporativeid;
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

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}
}
