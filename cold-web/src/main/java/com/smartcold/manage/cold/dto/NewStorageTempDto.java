package com.smartcold.manage.cold.dto;

import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public class NewStorageTempDto {
	private float startTemperature;
	private float tempdiff;
	private String name;
	private List<StorageKeyValue> list;
	private Map<String, List<StorageKeyValue>> tempMap;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<StorageKeyValue> getList() {
		return list;
	}

	public void setList(List<StorageKeyValue> list) {
		this.list = list;
	}

	public Map<String, List<StorageKeyValue>> getTempMap() {
		return tempMap;
	}

	public void setTempMap(Map<String, List<StorageKeyValue>> tempMap) {
		this.tempMap = tempMap;
	}
	
}
