package com.smartcold.zigbee.manage.entity;

/**
 * Created by qiangzi on 2017/7/19.
 */
public class SharedInfoEntity {
    private Integer datatype;
    private Integer typecode;
    private Double sqm;
    private Double unitPrice;
    private Integer stauts;

    public Integer getDatatype() {
        return datatype;
    }

    public void setDatatype(Integer datatype) {
        this.datatype = datatype;
    }

    public Integer getTypecode() {
        return typecode;
    }

    public void setTypecode(Integer typecode) {
        this.typecode = typecode;
    }

    public Double getSqm() {
        return sqm;
    }

    public void setSqm(Double sqm) {
        this.sqm = sqm;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getStauts() {
        return stauts;
    }

    public void setStauts(Integer stauts) {
        this.stauts = stauts;
    }
}
