package com.smartcold.bgzigbee.manage.dto;

import java.util.Date;

public class RdcEntityDTO {

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

    private float score;

    private int userRecommendPercent;

    private int userCommentCount;
    
    private String arrangePic;
    
    private Integer audit;
    
    private Integer userid;
    
    private String username;

    private int istemperaturestandard;
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
    

	public Integer getUserid() {
		return userid;
	}

	public void setUserid(Integer userid) {
		this.userid = userid;
	}

	public Integer getAudit() {
		return audit;
	}

	public void setAudit(Integer audit) {
		this.audit = audit;
	}

	public String getArrangePic() {
		return arrangePic;
	}

	public void setArrangePic(String arrangePic) {
		this.arrangePic = arrangePic;
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

    public float getScore() {
        return score;
    }

    public void setScore(float score) {
        this.score = score;
    }

    public int getUserRecommendPercent() {
        return userRecommendPercent;
    }

    public void setUserRecommendPercent(int userRecommendPercent) {
        this.userRecommendPercent = userRecommendPercent;
    }

    public int getUserCommentCount() {
        return userCommentCount;
    }

    public void setUserCommentCount(int userCommentCount) {
        this.userCommentCount = userCommentCount;
    }

    public int getIstemperaturestandard() {
        return istemperaturestandard;
    }

    public void setIstemperaturestandard(int istemperaturestandard) {
        this.istemperaturestandard = istemperaturestandard;
    }
}