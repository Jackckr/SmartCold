package com.smartcold.manage.cold.util.socket.entity;

import java.util.Date;
import java.util.List;

public class APInfo {
	private int type;    //包的类型，0数据包 1状态包 
	private int apid;    //apid
	private double tver; //版本 2表示2.0版，自定
	private int  sensorType; //传感器设备类型，1温度，2门，3电量
	private int sensorItemCnt;	//上报传感器数据集合数
	private List<TempInfo> tempInfos;//温度信息，指针数组，存放多个dev的温度数据
	private List<SwthInfo> swthInfos;//门信息，指针数组，存放多个dev的门数据
	private List<PwcInfo> pwcInfos; //电量信息，指针数组，存放多个dev的电量数据
	private Date time;  //ap上报时间戳
	
	private static ThreadLocal<APInfo> TLRD = new ThreadLocal<APInfo>();
	
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getApid() {
		return apid;
	}
	public void setApid(int apid) {
		this.apid = apid;
	}
	public double getTver() {
		return tver;
	}
	public void setTver(double tver) {
		this.tver = tver;
	}
	public int getSensorType() {
		return sensorType;
	}
	public void setSensorType(int sensorType) {
		this.sensorType = sensorType;
	}
	public int getSensorItemCnt() {
		return sensorItemCnt;
	}
	public void setSensorItemCnt(int sensorItemCnt) {
		this.sensorItemCnt = sensorItemCnt;
	}
	public List<TempInfo> getTempInfos() {
		return tempInfos;
	}
	public void setTempInfos(List<TempInfo> tempInfos) {
		this.tempInfos = tempInfos;
	}
	public List<SwthInfo> getSwthInfos() {
		return swthInfos;
	}
	public void setSwthInfos(List<SwthInfo> swthInfos) {
		this.swthInfos = swthInfos;
	}
	public List<PwcInfo> getPwcInfos() {
		return pwcInfos;
	}
	public void setPwcInfos(List<PwcInfo> pwcInfos) {
		this.pwcInfos = pwcInfos;
	}
	public Date getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time = new Date(time);
	}
	
	public static ThreadLocal<APInfo> getTLRD() {
		return TLRD;
	}
	public static void setTLRD(ThreadLocal<APInfo> tLRD) {
		TLRD = tLRD;
	}
	public static void clear() {
		TLRD.remove();
	}

	/**
	 * 获取当前可用的ResponseData对象
	 * @return
	 */
	public static <T> APInfo getInstance() {
		APInfo rd = TLRD.get();
		if (rd == null) {
			rd = new APInfo();
			TLRD.set(rd);
		}
		return rd;
	}
	
	
	
}
