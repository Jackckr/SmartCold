package com.smartcold.zigbee.manage.dto;

import java.io.File;
import java.util.List;

import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.StorageHonorEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-06-01 11:22)
 */
public class RdcAddDTO {

	private int rdcId;

	private int manageType; // 经营类型

	private int storageType;

	private int temperType;

	private float area; // 面积

	private int provinceId;

	private int cityId;

	private String name;

	private String address;
	
	

	private int coldTruck1;
	private int coldTruck2;
	private int coldTruck3;
	private int coldTruck4;

	private String phoneNum;

	private String telphoneNum;

	private String remark;

	private float tonnage;

	private int structure;

	private int companyDevice;

	private int platform;

	private int lihuoRoom;

	private float lihuoArea;

	private int lihuoTemperCtr;

	private int storageRefreg;

	private int temperRecord;

	private float capacity1;//冷库容积-面积
	private float capacity2;
	private float capacity3;
	private float capacity4;
	private String height1;//冷库容积-面积
	private String height2;
	private String height3;
	private String height4;
	private String facility;

	private float score;

	private int userRecommendPercent;

	private int userCommentCount;

	private int recommentCount;

	private float rdcPositionScore;

	private float rdcFacilityScore;

	private float rdcServiceScore;

	private float rdcHealthScore;
	
	private FileDataEntity arrangePic;

	private List<FileDataEntity> storagePics;
	
	private int userid;//关联用户id
	//浏览量
	private int pageview;

	private File honorfile0;

	private List<StorageHonorEntity> storageHonorPics;

	private List<FileDataEntity> honorPics;

	private Integer audit;

	private float height;

	private float rentSqm;

	private int openLIne;

	private int infoIntegrity;

	private int istemperaturestandard;

	private Double unitPrice;
	private int isJoinStand;

	private int auditType;//认证申请后的状态
	private String auditMsg;//认证申请后的信息

	private int standType;//达标申请后的状态
	private String standMsg;//达标申请后的信息

	private Double totalcapacity;//冷库总容量

	private String capacityunit;//冷库总容量单位

	private String rentcapacityunit;//可出租容量单位

	private String productcategory;//存放商品品类

	private Integer buildtype;//建筑类型

	private String website;//企业网址

	private Integer buildfloors;//建筑层数

	public String getHeight1() {
		return height1;
	}

	public void setHeight1(String height1) {
		this.height1 = height1;
	}

	public String getHeight2() {
		return height2;
	}

	public void setHeight2(String height2) {
		this.height2 = height2;
	}

	public String getHeight3() {
		return height3;
	}

	public void setHeight3(String height3) {
		this.height3 = height3;
	}

	public String getHeight4() {
		return height4;
	}

	public void setHeight4(String height4) {
		this.height4 = height4;
	}

	public int getPageview() {
		return pageview;
	}

	public void setPageview(int pageview) {
		this.pageview = pageview;
	}

	public int getUserId() {
		return userid;
	}

	public void setUserId(int userId) {
		this.userid = userId;
	}

	public FileDataEntity getArrangePic() {
		return arrangePic;
	}

	public void setArrangePic(FileDataEntity arrangePic) {
		this.arrangePic = arrangePic;
	}

	public List<FileDataEntity> getStoragePics() {
		return storagePics;
	}

	public void setStoragePics(List<FileDataEntity> storagePics) {
		this.storagePics = storagePics;
	}

	public int getRdcId() {
		return rdcId;
	}

	public void setRdcId(int rdcId) {
		this.rdcId = rdcId;
	}

	public int getManageType() {
		return manageType;
	}

	public void setManageType(int manageType) {
		this.manageType = manageType;
	}

	public int getStorageType() {
		return storageType;
	}

	public void setStorageType(int storageType) {
		this.storageType = storageType;
	}

	public int getTemperType() {
		return temperType;
	}

	public void setTemperType(int temperType) {
		this.temperType = temperType;
	}

	public float getArea() {
		return area;
	}

	public void setArea(float area) {
		this.area = area;
	}

	public int getProvinceId() {
		return provinceId;
	}

	public void setProvinceId(int provinceId) {
		this.provinceId = provinceId;
	}

	public int getCityId() {
		return cityId;
	}

	public void setCityId(int cityId) {
		this.cityId = cityId;
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

	public int getColdTruck1() {
		return coldTruck1;
	}

	public void setColdTruck1(int coldTruck1) {
		this.coldTruck1 = coldTruck1;
	}

	public int getColdTruck2() {
		return coldTruck2;
	}

	public void setColdTruck2(int coldTruck2) {
		this.coldTruck2 = coldTruck2;
	}

	public int getColdTruck3() {
		return coldTruck3;
	}

	public void setColdTruck3(int coldTruck3) {
		this.coldTruck3 = coldTruck3;
	}

	public int getColdTruck4() {
		return coldTruck4;
	}

	public void setColdTruck4(int coldTruck4) {
		this.coldTruck4 = coldTruck4;
	}

	public String getPhoneNum() {
		return phoneNum;
	}

	public void setPhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}

	public String getTelphoneNum() {
		return telphoneNum;
	}

	public void setTelphoneNum(String telphoneNum) {
		this.telphoneNum = telphoneNum;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public float getTonnage() {
		return tonnage;
	}

	public void setTonnage(float tonnage) {
		this.tonnage = tonnage;
	}

	public int getStructure() {
		return structure;
	}

	public void setStructure(int structure) {
		this.structure = structure;
	}

	public int getCompanyDevice() {
		return companyDevice;
	}

	public void setCompanyDevice(int companyDevice) {
		this.companyDevice = companyDevice;
	}

	public int getPlatform() {
		return platform;
	}

	public void setPlatform(int platform) {
		this.platform = platform;
	}

	public int getLihuoRoom() {
		return lihuoRoom;
	}

	public void setLihuoRoom(int lihuoRoom) {
		this.lihuoRoom = lihuoRoom;
	}

	public float getLihuoArea() {
		return lihuoArea;
	}

	public void setLihuoArea(float lihuoArea) {
		this.lihuoArea = lihuoArea;
	}

	public int getLihuoTemperCtr() {
		return lihuoTemperCtr;
	}

	public void setLihuoTemperCtr(int lihuoTemperCtr) {
		this.lihuoTemperCtr = lihuoTemperCtr;
	}

	public int getStorageRefreg() {
		return storageRefreg;
	}

	public void setStorageRefreg(int storageRefreg) {
		this.storageRefreg = storageRefreg;
	}

	public int getTemperRecord() {
		return temperRecord;
	}

	public void setTemperRecord(int temperRecord) {
		this.temperRecord = temperRecord;
	}

	public float getCapacity1() {
		return capacity1;
	}

	public void setCapacity1(float capacity1) {
		this.capacity1 = capacity1;
	}

	public float getCapacity2() {
		return capacity2;
	}

	public void setCapacity2(float capacity2) {
		this.capacity2 = capacity2;
	}

	public float getCapacity3() {
		return capacity3;
	}

	public void setCapacity3(float capacity3) {
		this.capacity3 = capacity3;
	}

	public float getCapacity4() {
		return capacity4;
	}

	public void setCapacity4(float capacity4) {
		this.capacity4 = capacity4;
	}

	public String getFacility() {
		return facility;
	}

	public void setFacility(String facility) {
		this.facility = facility;
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

	public int getRecommentCount() {
		return recommentCount;
	}

	public void setRecommentCount(int recommentCount) {
		this.recommentCount = recommentCount;
	}

	public float getRdcPositionScore() {
		return rdcPositionScore;
	}

	public void setRdcPositionScore(float rdcPositionScore) {
		this.rdcPositionScore = rdcPositionScore;
	}

	public float getRdcFacilityScore() {
		return rdcFacilityScore;
	}

	public void setRdcFacilityScore(float rdcFacilityScore) {
		this.rdcFacilityScore = rdcFacilityScore;
	}

	public float getRdcServiceScore() {
		return rdcServiceScore;
	}

	public void setRdcServiceScore(float rdcServiceScore) {
		this.rdcServiceScore = rdcServiceScore;
	}

	public float getRdcHealthScore() {
		return rdcHealthScore;
	}

	public void setRdcHealthScore(float rdcHealthScore) {
		this.rdcHealthScore = rdcHealthScore;
	}

	public File getHonorfile0() {
		return honorfile0;
	}

	public void setHonorfile0(File honorfile0) {
		this.honorfile0 = honorfile0;
	}

	public List<StorageHonorEntity> getStorageHonorPics() {
		return storageHonorPics;
	}

	public void setStorageHonorPics(List<StorageHonorEntity> storageHonorPics) {
		this.storageHonorPics = storageHonorPics;
	}

	public List<FileDataEntity> getHonorPics() {
		return honorPics;
	}

	public void setHonorPics(List<FileDataEntity> honorPics) {
		this.honorPics = honorPics;
	}

	public int getUserid() {
		return userid;
	}

	public void setUserid(int userid) {
		this.userid = userid;
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

	public Double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public int getIsJoinStand() {
		return isJoinStand;
	}

	public void setIsJoinStand(int isJoinStand) {
		this.isJoinStand = isJoinStand;
	}

	public int getAuditType() {
		return auditType;
	}

	public void setAuditType(int auditType) {
		this.auditType = auditType;
	}

	public int getStandType() {
		return standType;
	}

	public void setStandType(int standType) {
		this.standType = standType;
	}

	public String getAuditMsg() {
		return auditMsg;
	}

	public void setAuditMsg(String auditMsg) {
		this.auditMsg = auditMsg;
	}

	public String getStandMsg() {
		return standMsg;
	}

	public void setStandMsg(String standMsg) {
		this.standMsg = standMsg;
	}

	public Double getTotalcapacity() {
		return totalcapacity;
	}

	public void setTotalcapacity(Double totalcapacity) {
		this.totalcapacity = totalcapacity;
	}

	public String getCapacityunit() {
		return capacityunit;
	}

	public void setCapacityunit(String capacityunit) {
		this.capacityunit = capacityunit;
	}

	public String getRentcapacityunit() {
		return rentcapacityunit;
	}

	public void setRentcapacityunit(String rentcapacityunit) {
		this.rentcapacityunit = rentcapacityunit;
	}

	public String getProductcategory() {
		return productcategory;
	}

	public void setProductcategory(String productcategory) {
		this.productcategory = productcategory;
	}

	public Integer getBuildtype() {
		return buildtype;
	}

	public void setBuildtype(Integer buildtype) {
		this.buildtype = buildtype;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public Integer getBuildfloors() {
		return buildfloors;
	}

	public void setBuildfloors(Integer buildfloors) {
		this.buildfloors = buildfloors;
	}
}
