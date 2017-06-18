package com.smartcold.bgzigbee.manage.sc360.entity;

import java.util.Date;

public class DeviceObjectMappingEntity {

	private int id;

	private String deviceid;

	private int type;

	private int oid;

	private int rdcid;
	
	private int status;

	private Date addtime;
	
   private double du;//电压
   private double bsi;//信号强度
   private boolean isrdcid;//是否有效管理
	

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(String deviceid) {
		this.deviceid = deviceid;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getOid() {
		return oid;
	}

	public void setOid(int oid) {
		this.oid = oid;
	}

	public int getRdcid() {
		return rdcid;
	}

	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

	public double getDu() {
		return du;
	}

	public void setDu(double du) {
		this.du = du;
	}

	public double getBsi() {
		return bsi;
	}

	public void setBsi(double bsi) {
		this.bsi = bsi;
	}

	public boolean isIsrdcid() {
		return isrdcid;
	}

	public void setIsrdcid(boolean isrdcid) {
		this.isrdcid = isrdcid;
	}
	
	
}
