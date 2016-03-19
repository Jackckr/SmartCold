package com.smartcold.manage.cold.entity;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-03-19 11:54)
 */
public class GoodsColdStorageEntity {

    private int id;

    private int goodsId;

    private int coldStorageId;

    private float inputQuantity;

    private float outputQuantity;

    private float inputTemperature;

    private Date addTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(int goodsId) {
        this.goodsId = goodsId;
    }

    public int getColdStorageId() {
        return coldStorageId;
    }

    public void setColdStorageId(int coldStorageId) {
        this.coldStorageId = coldStorageId;
    }

    public float getInputQuantity() {
        return inputQuantity;
    }

    public void setInputQuantity(float inputQuantity) {
        this.inputQuantity = inputQuantity;
    }

    public float getOutputQuantity() {
        return outputQuantity;
    }

    public void setOutputQuantity(float outputQuantity) {
        this.outputQuantity = outputQuantity;
    }

    public float getInputTemperature() {
        return inputTemperature;
    }

    public void setInputTemperature(float inputTemperature) {
        this.inputTemperature = inputTemperature;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }
}
