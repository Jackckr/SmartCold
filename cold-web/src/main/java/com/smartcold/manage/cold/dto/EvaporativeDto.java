package com.smartcold.manage.cold.dto;

import java.util.List;

public class EvaporativeDto {

	private EvaporativeWaterDto evaWater;

	private List<EvaporativeBlowerDto> evaBlowers;

	public EvaporativeWaterDto getEvaWater() {
		return evaWater;
	}

	public void setEvaWater(EvaporativeWaterDto evaWater) {
		this.evaWater = evaWater;
	}

	public List<EvaporativeBlowerDto> getEvaBlowers() {
		return evaBlowers;
	}

	public void setEvaBlowers(List<EvaporativeBlowerDto> evaBlowers) {
		this.evaBlowers = evaBlowers;
	}

}
