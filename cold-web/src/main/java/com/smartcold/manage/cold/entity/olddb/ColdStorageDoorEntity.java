package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 10:30)
 */
public class ColdStorageDoorEntity {

    private int id;

    private int coldStorageDoorId;

    private Date startTime;

    private int state;

    private Date addTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getColdStorageDoorId() {
        return coldStorageDoorId;
    }

    public void setColdStorageDoorId(int coldStorageDoorId) {
        this.coldStorageDoorId = coldStorageDoorId;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }
}
