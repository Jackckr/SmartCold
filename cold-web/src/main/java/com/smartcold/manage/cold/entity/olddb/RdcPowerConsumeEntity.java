package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-04 11:53)
 */
public class RdcPowerConsumeEntity {

    private int id;

    private int rdcID;

    private float powerCosume;

    private Date addTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRdcID() {
        return rdcID;
    }

    public void setRdcID(int rdcID) {
        this.rdcID = rdcID;
    }

    public float getPowerCosume() {
        return powerCosume;
    }

    public void setPowerCosume(float powerCosume) {
        this.powerCosume = powerCosume;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }
}
