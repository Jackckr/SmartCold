package com.smartcold.manage.cold.dto;

import com.smartcold.manage.cold.entity.olddb.EvaporativeWaterSetEntity;

public class EvaporativeWaterDto extends EvaporativeWaterSetEntity {

	private int isRunning;

	public EvaporativeWaterDto(EvaporativeWaterSetEntity entity, int isRunning) {
		this.isRunning = isRunning;
		this.setAddTime(entity.getAddTime());
		this.setEvaporativeid(entity.getEvaporativeid());
		this.setId(entity.getId());
		this.setMapping(entity.getMapping());
		this.setName(entity.getName());
	}

	public int getIsRunning() {
		return isRunning;
	}

	public void setIsRunning(int isRunning) {
		this.isRunning = isRunning;
	}

}
