package com.smartcold.bgzigbee.manage.dto;

import com.smartcold.bgzigbee.manage.entity.RdcEntity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-23 20:41)
 */
public class RdcDTO {

    private int id;

    private String companykind;

    private String storagetype;

    private String storagetempertype;

    private float sqm;

    private String storagetruck;

    private int provinceId;

    private RdcEntity rdcEntity;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCompanykind() {
        return companykind;
    }

    public void setCompanykind(String companykind) {
        this.companykind = companykind;
    }

    public String getStoragetype() {
        return storagetype;
    }

    public void setStoragetype(String storagetype) {
        this.storagetype = storagetype;
    }

    public String getStoragetempertype() {
        return storagetempertype;
    }

    public void setStoragetempertype(String storagetempertype) {
        this.storagetempertype = storagetempertype;
    }

    public float getSqm() {
        return sqm;
    }

    public void setSqm(float sqm) {
        this.sqm = sqm;
    }

    public String getStoragetruck() {
        return storagetruck;
    }

    public void setStoragetruck(String storagetruck) {
        this.storagetruck = storagetruck;
    }

    public int getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(int provinceId) {
        this.provinceId = provinceId;
    }

    public RdcEntity getRdcEntity() {
        return rdcEntity;
    }

    public void setRdcEntity(RdcEntity rdcEntity) {
        this.rdcEntity = rdcEntity;
    }
}
