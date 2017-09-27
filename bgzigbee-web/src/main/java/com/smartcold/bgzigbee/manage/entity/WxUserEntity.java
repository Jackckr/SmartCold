package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Created by qiangzi on 2017/9/27.
 */
public class WxUserEntity {
   private int id;
   private String nickname;
   private String openid;
   private Date addtime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}
