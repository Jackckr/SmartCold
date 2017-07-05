package com.smartcold.zigbee.manage.entity;

import com.smartcold.zigbee.manage.service.FtpService;

import java.util.Date;

public class RdcEntity {

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

    private double longitude;

    private double latitude;

    private Integer audit;

    private float height;

    private float rentSqm;

    private int openLIne;

    private int infoIntegrity;

    private int istemperaturestandard;

    private int isJoinStand;

    private String logo;
	
	public int getUserId() {
		return userid;
	}

	public void setUserId(int userId) {
		this.userid = userId;
	}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address == null ? null : address.trim();
    }

    public Date getAddtime() {
        return addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public Integer getAudit() {
        return audit;
    }

    public void setAudit(Integer audit) {
        this.audit = audit;
    }

    public float getHeight() {
        return height;
    }

    public void setHeight(float height) {
        this.height = height;
    }

    public float getRentSqm() {
        return rentSqm;
    }

    public void setRentSqm(float rentSqm) {
        this.rentSqm = rentSqm;
    }

    public int getOpenLIne() {
        return openLIne;
    }

    public void setOpenLIne(int openLIne) {
        this.openLIne = openLIne;
    }

    public int getInfoIntegrity() {
        return infoIntegrity;
    }

    public void setInfoIntegrity(int infoIntegrity) {
        this.infoIntegrity = infoIntegrity;
    }

    public int getIstemperaturestandard() {
        return istemperaturestandard;
    }

    public void setIstemperaturestandard(int istemperaturestandard) {
        this.istemperaturestandard = istemperaturestandard;
    }

    public int getIsJoinStand() {
        return isJoinStand;
    }

    public void setIsJoinStand(int isJoinStand) {
        this.isJoinStand = isJoinStand;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = FtpService.READ_URL+ logo;
    }
}