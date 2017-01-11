package com.smartcold.manage.cold.dto;

import java.util.Map;

import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;

public class CompressorDto extends CompressorSetEntity {

	private Map<String, Double> keyValues;

	public CompressorDto(CompressorSetEntity entity, Map<String, Double> map) {
		this.setAddTime(entity.getAddTime());
		this.setCompressorgroupid(entity.getCompressorgroupid());
		this.setId(entity.getId());
		this.keyValues = map;
		this.setMapping(entity.getMapping());
		this.setName(entity.getName());
		this.setPower(entity.getPower());
		this.setType(entity.getType());
		this.setWaterRatio(entity.getWaterRatio());
		this.setHighTemp(entity.getHighTemp());
		this.setLowTemp(entity.getLowTemp());
	}

	public void putKeyValue(String key, Double value) {
		this.keyValues.put(key, value);
	}

	public Map<String, Double> getKeyValues() {
		return keyValues;
	}

	public void setKeyValues(Map<String, Double> keyValues) {
		this.keyValues = keyValues;
	}

}
