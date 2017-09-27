package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Created by qiangzi on 2017/9/22.
 */
public class UserOpenIdEntity {
    private Integer id;
    private Integer userid;
    private Integer wxuserid;
    private String username;
    private String nickname;
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

    public Integer getWxuserid() {
        return wxuserid;
    }

    public void setWxuserid(Integer wxuserid) {
        this.wxuserid = wxuserid;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
