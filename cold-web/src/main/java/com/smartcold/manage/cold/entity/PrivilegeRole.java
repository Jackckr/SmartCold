package com.smartcold.manage.cold.entity;

import java.util.Date;

public class PrivilegeRole {
    private Integer id;

    private Integer roleid;

    private Integer privid;

    private Date addtime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRoleid() {
        return roleid;
    }

    public void setRoleid(Integer roleid) {
        this.roleid = roleid;
    }

    public Integer getPrivid() {
        return privid;
    }

    public void setPrivid(Integer privid) {
        this.privid = privid;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }
}