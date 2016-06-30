package com.smartcold.bgzigbee.manage.entity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 15:58)
 */
public class ProvinceListEntity {

    private int provinceId;

    private byte areaId;

    private String provinceName;

    private byte provinceOrderId;

    private String provinceEnName;

    public int getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(int provinceId) {
        this.provinceId = provinceId;
    }

    public byte getAreaId() {
        return areaId;
    }

    public void setAreaId(byte areaId) {
        this.areaId = areaId;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public byte getProvinceOrderId() {
        return provinceOrderId;
    }

    public void setProvinceOrderId(byte provinceOrderId) {
        this.provinceOrderId = provinceOrderId;
    }

    public String getProvinceEnName() {
        return provinceEnName;
    }

    public void setProvinceEnName(String provinceEnName) {
        this.provinceEnName = provinceEnName;
    }
}
