package com.smartcold.manage.cold.dto;

import com.smartcold.manage.cold.entity.newdb.WallMaterialEntity;

public class WallEntity {

	private WallMaterialEntity material;

	private int thickness;

	private float outTemperature;

	public WallMaterialEntity getMaterial() {
		return material;
	}

	public void setMaterial(WallMaterialEntity material) {
		this.material = material;
	}

	public int getThickness() {
		return thickness;
	}

	public void setThickness(int thickness) {
		this.thickness = thickness;
	}

	public float getOutTemperature() {
		return outTemperature;
	}

	public void setOutTemperature(float outTemperature) {
		this.outTemperature = outTemperature;
	}
}
