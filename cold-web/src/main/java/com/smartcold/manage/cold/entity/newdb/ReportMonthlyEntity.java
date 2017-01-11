package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class ReportMonthlyEntity {
	private int id;

	private int storageID;

	private float temperature;

	private float totalCostEnergy;

	private float doorCostEnergy;

	private float lightCostEnergy;

	private float compressorCostEnergy;

	private float fanCostEnergy;

	private float goodsInOutCostEnergy;

	private Date date;

	private Date updateTime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getStorageID() {
		return storageID;
	}

	public void setStorageID(int storageID) {
		this.storageID = storageID;
	}

	public float getTemperature() {
		return temperature;
	}

	public void setTemperature(float temperature) {
		this.temperature = temperature;
	}

	public float getTotalCostEnergy() {
		return totalCostEnergy;
	}

	public void setTotalCostEnergy(float totalCostEnergy) {
		this.totalCostEnergy = totalCostEnergy;
	}

	public float getDoorCostEnergy() {
		return doorCostEnergy;
	}

	public void setDoorCostEnergy(float doorCostEnergy) {
		this.doorCostEnergy = doorCostEnergy;
	}

	public float getLightCostEnergy() {
		return lightCostEnergy;
	}

	public void setLightCostEnergy(float lightCostEnergy) {
		this.lightCostEnergy = lightCostEnergy;
	}

	public float getCompressorCostEnergy() {
		return compressorCostEnergy;
	}

	public void setCompressorCostEnergy(float compressorCostEnergy) {
		this.compressorCostEnergy = compressorCostEnergy;
	}

	public float getFanCostEnergy() {
		return fanCostEnergy;
	}

	public void setFanCostEnergy(float fanCostEnergy) {
		this.fanCostEnergy = fanCostEnergy;
	}

	public float getGoodsInOutCostEnergy() {
		return goodsInOutCostEnergy;
	}

	public void setGoodsInOutCostEnergy(float goodsInOutCostEnergy) {
		this.goodsInOutCostEnergy = goodsInOutCostEnergy;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
}
