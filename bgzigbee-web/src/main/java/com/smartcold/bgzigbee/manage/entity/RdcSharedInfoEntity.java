package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * Created by qiangzi on 2017/5/24.
 */
public class RdcSharedInfoEntity {
    private Integer id;
    private Integer rdcID;
    private Integer releaseID;
    private String codeLave1;
    private String codeLave2;
    private String codeLave3;
    private String codeLave4;
    private String title;
    private Integer dataType;
    private Integer typeCode;
    private String typeText;
    private Double unitPrice;
    private Double sqm;
    private String unit;
    private String unit1;
    private String unit2;
    private String attrvalue;
    private String detlAddress;
    private String validStartTime;
    private String validEndTime;
    private Integer applyID;
    private Integer bookings;
    private String telephone;
    private String note;
    private Integer stauts;
    private Integer stprovinceID;
    private Integer stcityID;
    private String staddress;
    private Integer toprovinceID;
    private Integer tocityID;
    private String toaddress;
    private Integer provinceid;
    private Integer cityid;
    private String address;
    private Date addtime;
    private Date updatetime;
    private String attrvalue1;
    private String attrvalue2;
    private String username;
    private RdcEntity rdcEntity;//映射rdc实体类

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRdcID() {
        return rdcID;
    }

    public void setRdcID(Integer rdcID) {
        this.rdcID = rdcID;
    }

    public Integer getReleaseID() {
        return releaseID;
    }

    public void setReleaseID(Integer releaseID) {
        this.releaseID = releaseID;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getDataType() {
        return dataType;
    }

    public void setDataType(Integer dataType) {
        this.dataType = dataType;
    }

    public Integer getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(Integer typeCode) {
        this.typeCode = typeCode;
    }

    public String getTypeText() {
        return typeText;
    }

    public void setTypeText(String typeText) {
        this.typeText = typeText;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getSqm() {
        return sqm;
    }

    public void setSqm(Double sqm) {
        this.sqm = sqm;
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

    public String getDetlAddress() {
        return detlAddress;
    }

    public void setDetlAddress(String detlAddress) {
        this.detlAddress = detlAddress;
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

    public Integer getApplyID() {
        return applyID;
    }

    public void setApplyID(Integer applyID) {
        this.applyID = applyID;
    }

    public Integer getBookings() {
        return bookings;
    }

    public void setBookings(Integer bookings) {
        this.bookings = bookings;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getStauts() {
        return stauts;
    }

    public void setStauts(Integer stauts) {
        this.stauts = stauts;
    }

    public Integer getStprovinceID() {
        return stprovinceID;
    }

    public void setStprovinceID(Integer stprovinceID) {
        this.stprovinceID = stprovinceID;
    }

    public Integer getStcityID() {
        return stcityID;
    }

    public void setStcityID(Integer stcityID) {
        this.stcityID = stcityID;
    }

    public String getStaddress() {
        return staddress;
    }

    public void setStaddress(String staddress) {
        this.staddress = staddress;
    }

    public Integer getToprovinceID() {
        return toprovinceID;
    }

    public void setToprovinceID(Integer toprovinceID) {
        this.toprovinceID = toprovinceID;
    }

    public Integer getTocityID() {
        return tocityID;
    }

    public void setTocityID(Integer tocityID) {
        this.tocityID = tocityID;
    }

    public String getToaddress() {
        return toaddress;
    }

    public void setToaddress(String toaddress) {
        this.toaddress = toaddress;
    }

    public Integer getProvinceid() {
        return provinceid;
    }

    public void setProvinceid(Integer provinceid) {
        this.provinceid = provinceid;
    }

    public Integer getCityid() {
        return cityid;
    }

    public void setCityid(Integer cityid) {
        this.cityid = cityid;
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

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
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

    public RdcEntity getRdcEntity() {
        return rdcEntity;
    }

    public void setRdcEntity(RdcEntity rdcEntity) {
        this.rdcEntity = rdcEntity;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
