package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Created by qiangzi on 2017/9/22.
 */
public class UserOpenIdEntity {
    private Integer id;
    private Integer userid;
    private String openId;
    private Date addtime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserid() {
        return userid;
    }

    public void setUserid(Integer userid) {
        this.userid = userid;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}
