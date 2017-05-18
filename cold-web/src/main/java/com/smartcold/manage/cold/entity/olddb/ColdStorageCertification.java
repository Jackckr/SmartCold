package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

/**
 * Created by qiangzi on 2017/5/18.
 */
/*冷库认证实体类*/
public class ColdStorageCertification {
    private Integer id;
    private Integer uid;//用户id
    private Integer rdcId;//冷库id
    private String certFile;//认证文件名
    private Date addTime;//认证时间

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getRdcId() {
        return rdcId;
    }

    public void setRdcId(Integer rdcId) {
        this.rdcId = rdcId;
    }

    public String getCertFile() {
        return certFile;
    }

    public void setCertFile(String certFile) {
        this.certFile = certFile;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }
}
