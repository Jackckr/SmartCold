package com.smartcold.zigbee.manage.dto;

import java.util.List;

import com.smartcold.zigbee.manage.service.FtpService;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: 库共享
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class RdcShareDTO {
	private int id; //
	private Integer uid;
	private int rdcID; // 睿库的ID
	private int releaseID; // 发布者id
	private int dataType; // 数据类型
	private String title; // share_title->name发布标题 :关联显示发布时的标题
	private int typeCode; // rental_type:出租类型:1:出租 2:求租
	private String typeText; //
	private String unitPrice; // +出租单价
	private String unit; // 单位: 
	private String unit1; // 单位1 ->出发地
	private String unit2; // 单位1 ->目的地
	private String attrvalue;// 附加值
	private String attrvalue1;
	private String attrvalue2;
	private String codeLave1; //
	private String codeLave2; //
	private String codeLave3; //
	private String codeLave4; //
	private String note; // 备注->拓展字段
	private String sqm; // 出租/求租->面积
	private String telephone;//联系电话
	private String validStartTime; // +开始有效期
	private String validEndTime; // 结束有效期
	private int applyID; // 申请者ID
	private int bookings; // 申请量
	private int stauts; // 当前消息是否有效 0：无效 1：有效
	private String addtime; // 添加时间
	private String updatetime; // 最后更新时间
	//->拓展字段  ->车
	
	private int stprovinceID;
	private int stcityID;
	private String staddress;
	private int toprovinceID;
	private int tocityID;
	private String toaddress;
	// rdc->关联rdc信息
	private String name;
    private int provinceid;//s所在省
    private int cityid;//s所在城市
	private String address;//地址
	private String detlAddress;//详细地址
	private String coldtype;
	private int audit;//审核状态：-1未通过，0待审核，1通过审核
	private  List<String> files;//图片组
	private String logo = "app/img/rdcHeader.jpg";// +FtpService.READ_URL+ logo
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	
	public Integer getUid() {
		return uid;
	}
	public void setUid(Integer uid) {
		this.uid = uid;
	}
	public int getRdcID() {
		return rdcID;
	}
	public void setRdcID(int rdcID) {
		this.rdcID = rdcID;
	}
	public int getReleaseID() {
		return releaseID;
	}
	public void setReleaseID(int releaseID) {
		this.releaseID = releaseID;
	}
	public int getDataType() {
		return dataType;
	}
	public void setDataType(int dataType) {
		this.dataType = dataType;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getTypeCode() {
		return typeCode;
	}
	public void setTypeCode(int typeCode) {
		this.typeCode = typeCode;
	}
	public String getTypeText() {
		return typeText;
	}
	public void setTypeText(String typeText) {
		this.typeText = typeText;
	}
	public String getUnitPrice() {
		return unitPrice;
	}
	public void setUnitPrice(String unitPrice) {
		if(unitPrice==""){unitPrice=null;}
		this.unitPrice = unitPrice;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getUnit1() {
		return unit1;
	}
	public void setUnit1(String unit1) {
		this.unit1 = unit1;
	}
	public String getUnit2() {
		return unit2;
	}
	public void setUnit2(String unit2) {
		this.unit2 = unit2;
	}
	public String getAttrvalue() {
		return attrvalue;
	}
	public void setAttrvalue(String attrvalue) {
		this.attrvalue = attrvalue;
	}
	public String getAttrvalue1() {
		return attrvalue1;
	}
	public void setAttrvalue1(String attrvalue1) {
		this.attrvalue1 = attrvalue1;
	}
	public String getAttrvalue2() {
		return attrvalue2;
	}
	public void setAttrvalue2(String attrvalue2) {
		this.attrvalue2 = attrvalue2;
	}
	public String getCodeLave1() {
		return codeLave1;
	}
	public void setCodeLave1(String codeLave1) {
		this.codeLave1 = codeLave1;
	}
	public String getCodeLave2() {
		return codeLave2;
	}
	public void setCodeLave2(String codeLave2) {
		this.codeLave2 = codeLave2;
	}
	public String getCodeLave3() {
		return codeLave3;
	}
	public void setCodeLave3(String codeLave3) {
		this.codeLave3 = codeLave3;
	}
	public String getCodeLave4() {
		return codeLave4;
	}
	public void setCodeLave4(String codeLave4) {
		this.codeLave4 = codeLave4;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public String getSqm() {
		return sqm;
	}
	public void setSqm(String sqm) {
		this.sqm = sqm;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getValidStartTime() {
		return validStartTime;
	}
	public void setValidStartTime(String validStartTime) {
		this.validStartTime = validStartTime;
	}
	public String getValidEndTime() {
		return validEndTime;
	}
	public void setValidEndTime(String validEndTime) {
		this.validEndTime = validEndTime;
	}
	public int getApplyID() {
		return applyID;
	}
	public void setApplyID(int applyID) {
		this.applyID = applyID;
	}
	public int getBookings() {
		return bookings;
	}
	public void setBookings(int bookings) {
		this.bookings = bookings;
	}
	public int getStauts() {
		return stauts;
	}
	public void setStauts(int stauts) {
		this.stauts = stauts;
	}
	public String getAddtime() {
		return addtime;
	}
	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}
	public String getUpdatetime() {
		return updatetime;
	}
	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}
	public int getStprovinceID() {
		return stprovinceID;
	}
	public void setStprovinceID(int stprovinceID) {
		this.stprovinceID = stprovinceID;
	}
	public int getStcityID() {
		return stcityID;
	}
	public void setStcityID(int stcityID) {
		this.stcityID = stcityID;
	}
	public String getStaddress() {
		return staddress;
	}
	public void setStaddress(String staddress) {
		this.staddress = staddress;
	}
	public int getToprovinceID() {
		return toprovinceID;
	}
	public void setToprovinceID(int toprovinceID) {
		this.toprovinceID = toprovinceID;
	}
	public int getTocityID() {
		return tocityID;
	}
	public void setTocityID(int tocityID) {
		this.tocityID = tocityID;
	}
	public String getToaddress() {
		return toaddress;
	}
	public void setToaddress(String toaddress) {
		this.toaddress = toaddress;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getColdtype() {
		return coldtype;
	}
	public void setColdtype(String coldtype) {
		this.coldtype = coldtype;
	}
	public List<String> getFiles() {
		return files;
	}
	public void setFiles(List<String> files) {
		this.files = files;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = FtpService.READ_URL+ logo;
	}
	public String getDetlAddress() {
		return detlAddress;
	}
	public void setDetlAddress(String detlAddress) {
		this.detlAddress = detlAddress;
	}

	public int getAudit() {
		return audit;
	}

	public void setAudit(int audit) {
		this.audit = audit;
	}
}