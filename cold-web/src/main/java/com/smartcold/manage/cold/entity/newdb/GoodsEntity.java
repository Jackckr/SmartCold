package com.smartcold.manage.cold.entity.newdb;

public class GoodsEntity {

	private int id;
	
	private int typeId;
	  
	private String name;
	  
	private float freezingPoint;
	  
	private float water;
	  
	private float breathHeat;
	  
	private float freezingHeat;
	  
	private float coolingHeat;
	  
	private float latentHeat;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getTypeId() {
		return typeId;
	}

	public void setTypeId(int typeId) {
		this.typeId = typeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public float getFreezingPoint() {
		return freezingPoint;
	}

	public void setFreezingPoint(float freezingPoint) {
		this.freezingPoint = freezingPoint;
	}

	public float getWater() {
		return water;
	}

	public void setWater(float water) {
		this.water = water;
	}

	public float getBreathHeat() {
		return breathHeat;
	}

	public void setBreathHeat(float breathHeat) {
		this.breathHeat = breathHeat;
	}

	public float getFreezingHeat() {
		return freezingHeat;
	}

	public void setFreezingHeat(float freezingHeat) {
		this.freezingHeat = freezingHeat;
	}

	public float getCoolingHeat() {
		return coolingHeat;
	}

	public void setCoolingHeat(float coolingHeat) {
		this.coolingHeat = coolingHeat;
	}

	public float getLatentHeat() {
		return latentHeat;
	}

	public void setLatentHeat(float latentHeat) {
		this.latentHeat = latentHeat;
	}
	

}
