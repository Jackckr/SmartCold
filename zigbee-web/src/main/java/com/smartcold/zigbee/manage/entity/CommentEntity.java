package com.smartcold.zigbee.manage.entity;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-04-28 20:18)
 */
public class CommentEntity {
    private int id;

    private int rdcID;

    private int commerID;

    private String content;

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

    public int getCommerID() {
        return commerID;
    }

    public void setCommerID(int commerID) {
        this.commerID = commerID;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }
}
