package com.smartcold.bgzigbee.manage.dto;

import java.util.List;

import com.smartcold.bgzigbee.manage.entity.FileDataEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-06-01 11:22)
 */
public class RdcAddDTO {

	private int rdcId;

	private int manageType; // 经营类型

	private int storageType;

	private int temperType;

	private float area; // 面积

	private String contact;//联系人

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
	
	private String arrangepiclocation;

	private String storagePicLocation;
	
	private FileDataEntity arrangePic;

	private float rentSqm;

	private float height;

	private List<FileDataEntity> storagePics;

	private List<FileDataEntity> honorPics;

	private List<RdcAuthDTO> authPics;

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

	public String getArrangepiclocation() {
		return arrangepiclocation;
	}

	public void setArrangepiclocation(String arrangepiclocation) {
		this.arrangepiclocation = arrangepiclocation;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
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

	public String getStoragePicLocation() {
		return storagePicLocation;
	}

	public void setStoragePicLocation(String storagePicLocation) {
		this.storagePicLocation = storagePicLocation;
	}

	public List<FileDataEntity> getHonorPics() {
		return honorPics;
	}

	public void setHonorPics(List<FileDataEntity> honorPics) {
		this.honorPics = honorPics;
	}

	public List<RdcAuthDTO> getAuthPics() {
		return authPics;
	}

	public void setAuthPics(List<RdcAuthDTO> authPics) {
		this.authPics = authPics;
	}

	public float getRentSqm() {
		return rentSqm;
	}

	public void setRentSqm(float rentSqm) {
		this.rentSqm = rentSqm;
	}

	public float getHeight() {
		return height;
	}

	public void setHeight(float height) {
		this.height = height;
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
