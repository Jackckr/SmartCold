package com.smartcold.manage.cold.entity;

import java.util.Date;

public class RdcSensor {
    private Integer rsid;

    private Integer sid;

    private Integer rdcid;

    private Integer sx;

    private Integer sy;

    private Date addtime;

    public Integer getRsid() {
        return rsid;
    }

    public void setRsid(Integer rsid) {
        this.rsid = rsid;
    }

    public Integer getSid() {
        return sid;
    }

    public void setSid(Integer sid) {
        this.sid = sid;
    }

    public Integer getRdcid() {
        return rdcid;
    }

    public void setRdcid(Integer rdcid) {
        this.rdcid = rdcid;
    }

    public Integer getSx() {
        return sx;
    }

    public void setSx(Integer sx) {
        this.sx = sx;
    }

    public Integer getSy() {
        return sy;
    }

    public void setSy(Integer sy) {
        this.sy = sy;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}