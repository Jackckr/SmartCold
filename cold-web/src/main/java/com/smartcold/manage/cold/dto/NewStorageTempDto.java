package com.smartcold.manage.cold.dto;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public class NewStorageTempDto {
	private float startTemperature;
	private List<StorageKeyValue> list;
	public float getStartTemperature() {
		return startTemperature;
	}
	public void setStartTemperature(float startTemperature) {
		this.startTemperature = startTemperature;
	}
	public List<StorageKeyValue> getList() {
		return list;
	}
	public void setList(List<StorageKeyValue> list) {
		this.list = list;
	}
}
