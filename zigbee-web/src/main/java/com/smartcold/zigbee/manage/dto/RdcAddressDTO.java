package com.smartcold.zigbee.manage.dto;

import java.util.Date;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-07-02 10:18)
 */
public class RdcAddressDTO {
    private int id;

    private String name;

    private String address;

    private Date addtime;

    private int type;

    private float capacity;

    private float sqm;

    private String struct;

    private String storagetype;

    private String coldtype;

    private int provinceid;

    private int cityid;

    private String contact;

    private String position;

    private String cellphone;

    private String phone;

    private String commit;

    private float powerConsume;

    private int userid;//关联用户id

    private String lng;

    private String lat;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public float getCapacity() {
        return capacity;
    }

    public void setCapacity(float capacity) {
        this.capacity = capacity;
    }

    public float getSqm() {
        return sqm;
    }

    public void setSqm(float sqm) {
        this.sqm = sqm;
    }

    public String getStruct() {
        return struct;
    }

    public void setStruct(String struct) {
        this.struct = struct;
    }

    public String getStoragetype() {
        return storagetype;
    }

    public void setStoragetype(String storagetype) {
        this.storagetype = storagetype;
    }

    public String getColdtype() {
        return coldtype;
    }

    public void setColdtype(String coldtype) {
        this.coldtype = coldtype;
    }

    public int getProvinceid() {
        return provinceid;
    }

    public void setProvinceid(int provinceid) {
        this.provinceid = provinceid;
    }

    public int getCityid() {
        return cityid;
    }

    public void setCityid(int cityid) {
        this.cityid = cityid;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getCellphone() {
        return cellphone;
    }

    public void setCellphone(String cellphone) {
        this.cellphone = cellphone;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCommit() {
        return commit;
    }

    public void setCommit(String commit) {
        this.commit = commit;
    }

    public float getPowerConsume() {
        return powerConsume;
    }

    public void setPowerConsume(float powerConsume) {
        this.powerConsume = powerConsume;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public String getLng() {
        return lng;
    }

    public void setLng(String lng) {
        this.lng = lng;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }
}
