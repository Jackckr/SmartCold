package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class Weather {

	private int id;

	private String cityID;

	private String cityName;

	private float temp1;

	private float temp2;

	private String weather;

	private Date addTime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCityID() {
		return cityID;
	}

	public void setCityID(String cityID) {
		this.cityID = cityID;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public float getTemp1() {
		return temp1;
	}

	public void setTemp1(float temp1) {
		this.temp1 = temp1;
	}

	public float getTemp2() {
		return temp2;
	}

	public void setTemp2(float temp2) {
		this.temp2 = temp2;
	}

	public String getWeather() {
		return weather;
	}

	public void setWeather(String weather) {
		this.weather = weather;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
