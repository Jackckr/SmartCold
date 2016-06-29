package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 16:28)
 */
public class CompressorGroupSetEntity {

    private int id;

    private int groupId;

    private int rdcId;

    private float lowPress;

    private float pressDiff;

    private float meltFrostTemperature;

    private Date addTime;
    
    private String mapping;

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

    public int getRdcId() {
        return rdcId;
    }

    public void setRdcId(int rdcId) {
        this.rdcId = rdcId;
    }

    public float getLowPress() {
        return lowPress;
    }

    public void setLowPress(float lowPress) {
        this.lowPress = lowPress;
    }

    public float getPressDiff() {
        return pressDiff;
    }

    public void setPressDiff(float pressDiff) {
        this.pressDiff = pressDiff;
    }

    public float getMeltFrostTemperature() {
        return meltFrostTemperature;
    }

    public void setMeltFrostTemperature(float meltFrostTemperature) {
        this.meltFrostTemperature = meltFrostTemperature;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
	}

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}
}
