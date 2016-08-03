package com.smartcold.manage.cold.entity.olddb;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 11:52)
 */
public class ColdStorageLightSetEntity {

    private int id;

    private int coldStorageId;

    private float power;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getColdStorageId() {
        return coldStorageId;
    }

    public void setColdStorageId(int coldStorageId) {
        this.coldStorageId = coldStorageId;
    }

    public float getPower() {
        return power;
    }

    public void setPower(float power) {
        this.power = power;
    }
}
