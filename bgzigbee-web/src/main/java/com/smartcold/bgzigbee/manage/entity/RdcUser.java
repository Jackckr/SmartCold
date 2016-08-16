package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class RdcUser {
    private Integer id;

    private Integer rdcid;

    private Integer userid;

    private Date addtime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRdcid() {
        return rdcid;
    }

    public void setRdcid(Integer rdcid) {
        this.rdcid = rdcid;
    }

    public Integer getUserid() {
        return userid;
    }

    public void setUserid(Integer userid) {
        this.userid = userid;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}