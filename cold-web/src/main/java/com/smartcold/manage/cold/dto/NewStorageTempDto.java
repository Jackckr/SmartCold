package com.smartcold.manage.cold.dto;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public class NewStorageTempDto {
	private float startTemperature;
	private float tempdiff;
	private List<StorageKeyValue> list;

	public float getStartTemperature() {
		return startTemperature;
	}

	public void setStartTemperature(float startTemperature) {
		this.startTemperature = startTemperature;
	}

	public float getTempdiff() {
		return tempdiff;
	}

	public void setTempdiff(float tempdiff) {
		this.tempdiff = tempdiff;
	}

	public List<StorageKeyValue> getList() {
		return list;
	}

	public void setList(List<StorageKeyValue> list) {
		this.list = list;
	}
}
