package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 11:53)
 */
public class BlowerEntity {

    private int id;
    
    private String name;

    private int blowerId;

    private Date startTime;

    private int state;

    private Date addTime;

    private int isRunning;

    private int isDefrosting;
    
    private int coldStorageId	;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getBlowerId() {
        return blowerId;
    }

    public void setBlowerId(int blowerId) {
        this.blowerId = blowerId;
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

    public int getIsRunning() {
        return isRunning;
    }

    public void setIsRunning(int isRunning) {
        this.isRunning = isRunning;
    }

    public int getIsDefrosting() {
        return isDefrosting;
    }

    public void setIsDefrosting(int isDefrosting) {
        this.isDefrosting = isDefrosting;
    }

	public int getColdStorageId() {
		return coldStorageId;
	}

	public void setColdStorageId(int coldStorageId) {
		this.coldStorageId = coldStorageId;
	}
    
    
}
