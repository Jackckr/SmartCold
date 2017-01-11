package com.smartcold.manage.cold.entity.newdb;

public class AirPropertyEntity {

	private int id;

	private int temperature;

	private float density;

	private float specificHeat;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getTemperature() {
		return temperature;
	}

	public void setTemperature(int temperature) {
		this.temperature = temperature;
	}

	public float getDensity() {
		return density;
	}

	public void setDensity(float density) {
		this.density = density;
	}

	public float getSpecificHeat() {
		return specificHeat;
	}

	public void setSpecificHeat(float specificHeat) {
		this.specificHeat = specificHeat;
	}

}
