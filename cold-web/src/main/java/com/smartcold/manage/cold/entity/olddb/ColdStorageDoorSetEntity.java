package com.smartcold.manage.cold.entity.olddb;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 11:51)
 */
public class ColdStorageDoorSetEntity {

    private int id;

    private int coldStorageId;

    private int rdcId;

    private float length;

    private float width;
    
    private String name;
    
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

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

    public int getRdcId() {
        return rdcId;
    }

    public void setRdcId(int rdcId) {
        this.rdcId = rdcId;
    }

    public float getLength() {
        return length;
    }

    public void setLength(float length) {
        this.length = length;
    }

    public float getWidth() {
        return width;
    }

    public void setWidth(float width) {
        this.width = width;
    }
}
