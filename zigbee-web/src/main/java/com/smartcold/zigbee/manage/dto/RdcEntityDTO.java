package com.smartcold.zigbee.manage.dto;

import java.util.Date;

import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.service.FtpService;

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
    
    private FileDataEntity storagePic;

    private int pageview;
    
    private String logo = "/app/img/rdcHeader.jpg";// +FtpService.READ_URL+ logo

    private int istemperaturestandard;

    private String tempTypeStr;

    private String manageTypeStr;

    private int rdcscore;

    private int audit;
    /*==============================共享信息==================================================*/
    private double rentSqm;
    private int datatype;
    private int typecode;
    private double unitPrice;
    private int shareStauts;
	public FileDataEntity getStoragePic() {
		return storagePic;
	}

	public void setStoragePic(FileDataEntity storagePic) {
		this.storagePic = storagePic;
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

    public int getPageview() {
        return pageview;
    }

    public void setPageview(int pageview) {
        this.pageview = pageview;
    }
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = FtpService.READ_URL+ logo;
	}

    public int getIstemperaturestandard() {
        return istemperaturestandard;
    }

    public void setIstemperaturestandard(int istemperaturestandard) {
        this.istemperaturestandard = istemperaturestandard;
    }

    public String getTempTypeStr() {
        return tempTypeStr;
    }

    public void setTempTypeStr(String tempTypeStr) {
        this.tempTypeStr = tempTypeStr;
    }

    public String getManageTypeStr() {
        return manageTypeStr;
    }

    public void setManageTypeStr(String manageTypeStr) {
        this.manageTypeStr = manageTypeStr;
    }

    public int getDatatype() {
        return datatype;
    }

    public void setDatatype(int datatype) {
        this.datatype = datatype;
    }

    public int getTypecode() {
        return typecode;
    }

    public void setTypecode(int typecode) {
        this.typecode = typecode;
    }

    public int getRdcscore() {
        return rdcscore;
    }

    public void setRdcscore(int rdcscore) {
        this.rdcscore = rdcscore;
    }

    public double getRentSqm() {
        return rentSqm;
    }

    public void setRentSqm(double rentSqm) {
        this.rentSqm = rentSqm;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getAudit() {
        return audit;
    }

    public void setAudit(int audit) {
        this.audit = audit;
    }

    public int getShareStauts() {
        return shareStauts;
    }

    public void setShareStauts(int shareStauts) {
        this.shareStauts = shareStauts;
    }
}