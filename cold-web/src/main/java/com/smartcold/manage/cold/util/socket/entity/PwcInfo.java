package com.smartcold.manage.cold.util.socket.entity;

import java.util.Date;

public class PwcInfo {

	private int devid;  //devid
	private float PWC;  //电量
	private float AU;  //A相电压
	private float BU;  //B相电压
	private float CU;  //C相电压
	private float AI;  //A相电流
	private float BI;  //B相电流
	private float CI;  //C相电流
	private Date time; //电量采集时间
	
	
	
	public PwcInfo() {
		super();
	}
	public PwcInfo(int devid, float pWC, float aU, float bU, float cU,float aI, float bI, float cI, Long time) {
		super();
		this.devid = devid;
		PWC = pWC;
		AU = aU;
		BU = bU;
		CU = cU;
		AI = aI;
		BI = bI;
		CI = cI;
		this.time = new Date(time);
	}
	public int getDevid() {
		return devid;
	}
	public void setDevid(int devid) {
		this.devid = devid;
	}
	public float getPWC() {
		return PWC;
	}
	public void setPWC(float pWC) {
		PWC = pWC;
	}
	public float getAU() {
		return AU;
	}
	public void setAU(float aU) {
		AU = aU;
	}
	public float getBU() {
		return BU;
	}
	public void setBU(float bU) {
		BU = bU;
	}
	public float getCU() {
		return CU;
	}
	public void setCU(float cU) {
		CU = cU;
	}
	public float getAI() {
		return AI;
	}
	public void setAI(float aI) {
		AI = aI;
	}
	public float getBI() {
		return BI;
	}
	public void setBI(float bI) {
		BI = bI;
	}
	public float getCI() {
		return CI;
	}
	public void setCI(float cI) {
		CI = cI;
	}
	public Date getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time = new Date(time);
	}
	
	
	
}
