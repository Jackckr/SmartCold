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

    private float refrigerationTime;

    private int fanStatus;

    private float meltFrostTime;

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

    public float getRefrigerationTime() {
        return refrigerationTime;
    }

    public void setRefrigerationTime(float refrigerationTime) {
        this.refrigerationTime = refrigerationTime;
    }

    public int getFanStatus() {
        return fanStatus;
    }

    public void setFanStatus(int fanStatus) {
        this.fanStatus = fanStatus;
    }

    public float getMeltFrostTime() {
        return meltFrostTime;
    }

    public void setMeltFrostTime(float meltFrostTime) {
        this.meltFrostTime = meltFrostTime;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }
}
