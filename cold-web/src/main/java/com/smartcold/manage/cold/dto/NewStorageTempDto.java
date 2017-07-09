package com.smartcold.manage.cold.dto;

import java.util.List;
import java.util.Map;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;

public class NewStorageTempDto {
	private Integer index;
	private String name;
	private Long systime;
	private float tempdiff;
	private float startTemperature;
	private List<StorageKeyValue> list;
	private Map<String, List<StorageKeyValue>> tempMap;

	public Long getSystime() {
		return systime;
	}

	public void setSystime(Long systime) {
		this.systime = systime;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}

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
