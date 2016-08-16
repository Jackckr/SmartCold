package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class RdcAuthLogEntity {

    private Integer id;

    private String type;

    private Integer authuserid;

    private Integer applyuserid;

    private Integer changeduserid;

    private String desc;

    private Date addtime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getAuthuserid() {
        return authuserid;
    }

    public void setAuthuserid(Integer authuserid) {
        this.authuserid = authuserid;
    }

    public Integer getApplyuserid() {
        return applyuserid;
    }

    public void setApplyuserid(Integer applyuserid) {
        this.applyuserid = applyuserid;
    }

    public Integer getChangeduserid() {
        return changeduserid;
    }

    public void setChangeduserid(Integer changeduserid) {
        this.changeduserid = changeduserid;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}