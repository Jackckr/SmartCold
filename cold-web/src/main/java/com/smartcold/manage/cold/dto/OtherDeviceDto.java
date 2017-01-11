package com.smartcold.manage.cold.dto;

import java.util.Date;
import java.util.List;

public class OtherDeviceDto {

	private List<CostEntity> forkLift;

	private List<CostEntity> windScreen;

	private List<CostEntity> pressurePlatform;

	private List<CostEntity> chargingPile;

	public List<CostEntity> getForkLift() {
		return forkLift;
	}

	public void setForkLift(List<CostEntity> forkLift) {
		this.forkLift = forkLift;
	}

	public List<CostEntity> getWindScreen() {
		return windScreen;
	}

	public void setWindScreen(List<CostEntity> windScreen) {
		this.windScreen = windScreen;
	}

	public List<CostEntity> getPressurePlatform() {
		return pressurePlatform;
	}

	public void setPressurePlatform(List<CostEntity> pressurePlatform) {
		this.pressurePlatform = pressurePlatform;
	}

	public List<CostEntity> getChargingPile() {
		return chargingPile;
	}

	public void setChargingPile(List<CostEntity> chargingPile) {
		this.chargingPile = chargingPile;
	}

	public void addForkLift(double cost, Date time) {
		this.forkLift.add(new CostEntity(cost, time));
	}

	public void addWindScreen(double cost, Date time) {
		this.windScreen.add(new CostEntity(cost, time));
	}

	public void addPressurePlatform(double cost, Date time) {
		this.pressurePlatform.add(new CostEntity(cost, time));
	}

	public void addChargingPile(double cost, Date time) {
		this.chargingPile.add(new CostEntity(cost, time));
	}
}
