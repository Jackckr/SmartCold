package com.smartcold.zigbee.manage.dto;

import java.util.ArrayList;
import java.util.List;

import com.smartcold.zigbee.manage.entity.CompleteInfoEntity;
import com.smartcold.zigbee.manage.entity.MergeCompleteInfoEntity;

public class SingleInfoEntity {

	private String key;

	private int overTemperatureTimes;

	private List<CompleteInfoEntity> infos;

	private List<MergeCompleteInfoEntity> ananysis;

	public SingleInfoEntity() {
		this.ananysis = new ArrayList<MergeCompleteInfoEntity>();
		this.overTemperatureTimes = 0;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public int getOverTemperatureTimes() {
		return overTemperatureTimes;
	}

	public void setOverTemperatureTimes(int overTemperatureTimes) {
		this.overTemperatureTimes = overTemperatureTimes;
	}

	public void incOverTemperatureTimes() {
		this.overTemperatureTimes++;
	}

	public List<CompleteInfoEntity> getInfos() {
		return infos;
	}

	public void setInfos(List<CompleteInfoEntity> infos) {
		this.infos = infos;
	}

	public void addAnanysis(MergeCompleteInfoEntity e) {
		this.ananysis.add(e);
	}

	public List<MergeCompleteInfoEntity> getAnanysis() {
		return ananysis;
	}

	public void setAnanysis(List<MergeCompleteInfoEntity> ananysis) {
		this.ananysis = ananysis;
	}

}
