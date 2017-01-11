package com.smartcold.manage.cold.dto;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-01 23:29)
 */
@Deprecated
public class ColdStorageTemperDTO {
    private int id;

    private int storageID;

    private float temperature;

    private float startTemperature;

    private Date time;

    private Date addTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStorageID() {
        return storageID;
    }

    public void setStorageID(int storageID) {
        this.storageID = storageID;
    }

    public float getTemperature() {
        return temperature;
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
    }

    public float getStartTemperature() {
        return startTemperature;
    }

    public void setStartTemperature(float startTemperature) {
        this.startTemperature = startTemperature;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }

}
