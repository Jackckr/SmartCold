package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

public class CityListEntity {
	private int cityID;

	private String cityName;

	private int provinceID;

	private int dailySearchCount;

	private String cityEnName;

	private String cityAreaCode;

	private String cityAbbrCode;

	private int cityLevel;

	private double gLat;

	private double gLng;

	private Date addDate;

	public int getCityID() {
		return cityID;
	}

	public void setCityID(int cityID) {
		this.cityID = cityID;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public int getProvinceID() {
		return provinceID;
	}

	public void setProvinceID(int provinceID) {
		this.provinceID = provinceID;
	}

	public int getDailySearchCount() {
		return dailySearchCount;
	}

	public void setDailySearchCount(int dailySearchCount) {
		this.dailySearchCount = dailySearchCount;
	}

	public String getCityEnName() {
		return cityEnName;
	}

	public void setCityEnName(String cityEnName) {
		this.cityEnName = cityEnName;
	}

	public String getCityAreaCode() {
		return cityAreaCode;
	}

	public void setCityAreaCode(String cityAreaCode) {
		this.cityAreaCode = cityAreaCode;
	}

	public String getCityAbbrCode() {
		return cityAbbrCode;
	}

	public void setCityAbbrCode(String cityAbbrCode) {
		this.cityAbbrCode = cityAbbrCode;
	}

	public int getCityLevel() {
		return cityLevel;
	}

	public void setCityLevel(int cityLevel) {
		this.cityLevel = cityLevel;
	}

	public double getgLat() {
		return gLat;
	}

	public void setgLat(double gLat) {
		this.gLat = gLat;
	}

	public double getgLng() {
		return gLng;
	}

	public void setgLng(double gLng) {
		this.gLng = gLng;
	}

	public Date getAddDate() {
		return addDate;
	}

	public void setAddDate(Date addDate) {
		this.addDate = addDate;
	}

}
