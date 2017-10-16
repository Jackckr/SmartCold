package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Created by qiangzi on 2017/10/16.
 */
public class RdcSpider {
    private int id;
    private Integer rdcid;
    private String mapping;
    private Date addtime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getRdcid() {
        return rdcid;
    }

    public void setRdcid(Integer rdcid) {
        this.rdcid = rdcid;
    }

    public String getMapping() {
        return mapping;
    }

    public void setMapping(String mapping) {
        this.mapping = mapping;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}
