package com.smartcold.manage.cold.entity;

import java.util.Date;

public class CompressorGroupEntity {

  private int id;
  
  private int groupId;
  
  private float highPress;
  
  private float lowPress;
  
  private float exhaustTemperature;
  private float oilColdTemperature;
  
  private float oilInnerTemperature;
  
  private float breatheTemperature;
  
  private float outWaterPress;
  
  private float outWaterTemperature;
  
  private int waterPumpTime;
  
  private int fanTime;
  
  private int groupStatus;
  
  private int oilLowSwitch;
  
  private int waterSwitch;
  
  private int refrigerationSwitch;
  
  private int contactorSwitch;
  
  private int externalSwitch;
  
  private int powerProtected;
  
  private Date addTime;

public int getId() {
	return id;
}

public void setId(int id) {
	this.id = id;
}

public int getGroupId() {
	return groupId;
}

public void setGroupId(int groupId) {
	this.groupId = groupId;
}

public float getHighPress() {
	return highPress;
}

public void setHighPress(float highPress) {
	this.highPress = highPress;
}

public float getLowPress() {
	return lowPress;
}

public void setLowPress(float lowPress) {
	this.lowPress = lowPress;
}

public float getExhaustTemperature() {
	return exhaustTemperature;
}

public void setExhaustTemperature(float exhaustTemperature) {
	this.exhaustTemperature = exhaustTemperature;
}

public float getOilColdTemperature() {
	return oilColdTemperature;
}

public void setOilColdTemperature(float oilColdTemperature) {
	this.oilColdTemperature = oilColdTemperature;
}

public float getOilInnerTemperature() {
	return oilInnerTemperature;
}

public void setOilInnerTemperature(float oilInnerTemperature) {
	this.oilInnerTemperature = oilInnerTemperature;
}

public float getBreatheTemperature() {
	return breatheTemperature;
}

public void setBreatheTemperature(float breatheTemperature) {
	this.breatheTemperature = breatheTemperature;
}

public float getOutWaterPress() {
	return outWaterPress;
}

public void setOutWaterPress(float outWaterPress) {
	this.outWaterPress = outWaterPress;
}

public float getOutWaterTemperature() {
	return outWaterTemperature;
}

public void setOutWaterTemperature(float outWaterTemperature) {
	this.outWaterTemperature = outWaterTemperature;
}

public int getWaterPumpTime() {
	return waterPumpTime;
}

public void setWaterPumpTime(int waterPumpTime) {
	this.waterPumpTime = waterPumpTime;
}

public int getFanTime() {
	return fanTime;
}

public void setFanTime(int fanTime) {
	this.fanTime = fanTime;
}

public int getGroupStatus() {
	return groupStatus;
}

public void setGroupStatus(int groupStatus) {
	this.groupStatus = groupStatus;
}

public int getOilLowSwitch() {
	return oilLowSwitch;
}

public void setOilLowSwitch(int oilLowSwitch) {
	this.oilLowSwitch = oilLowSwitch;
}

public int getWaterSwitch() {
	return waterSwitch;
}

public void setWaterSwitch(int waterSwitch) {
	this.waterSwitch = waterSwitch;
}

public int getRefrigerationSwitch() {
	return refrigerationSwitch;
}

public void setRefrigerationSwitch(int refrigerationSwitch) {
	this.refrigerationSwitch = refrigerationSwitch;
}

public int getContactorSwitch() {
	return contactorSwitch;
}

public void setContactorSwitch(int contactorSwitch) {
	this.contactorSwitch = contactorSwitch;
}

public int getExternalSwitch() {
	return externalSwitch;
}

public void setExternalSwitch(int externalSwitch) {
	this.externalSwitch = externalSwitch;
}

public int getPowerProtected() {
	return powerProtected;
}

public void setPowerProtected(int powerProtected) {
	this.powerProtected = powerProtected;
}

public Date getAddTime() {
	return addTime;
}

public void setAddTime(Date addTime) {
	this.addTime = addTime;
}


}
