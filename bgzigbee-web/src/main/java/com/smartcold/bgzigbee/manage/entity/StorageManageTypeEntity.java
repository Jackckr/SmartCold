package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:17)
 */
public class StorageManageTypeEntity {

    private int id;

    private String type;

    private Date addTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }

}
