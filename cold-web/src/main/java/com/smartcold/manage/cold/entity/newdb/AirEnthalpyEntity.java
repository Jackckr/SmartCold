package com.smartcold.manage.cold.entity.newdb;

public class AirEnthalpyEntity {

	private int id;

	private int temperature;

	private float humidity;

	private float enthalpy;

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

	public float getHumidity() {
		return humidity;
	}

	public void setHumidity(float humidity) {
		this.humidity = humidity;
	}

	public float getEnthalpy() {
		return enthalpy;
	}

	public void setEnthalpy(float enthalpy) {
		this.enthalpy = enthalpy;
	}
}
