package com.smartcold.manage.cold.util.socket.entity;

import java.util.Date;
import java.util.List;

public class DevStateInfo {
	private int type;    //包的类型，0数据包 1状态包
	private int apid;    //apid
	private int MSI;  //移动信号强度，0~10,10最高
	private int LAC;  //基站位置信息LAC
	private int CID;  //基站位置信息CI
	private int devCnt;
	private List<DevInfo> devInfos;
	private Date time;  //状态上报时间
	private static ThreadLocal<DevStateInfo> TLRD = new ThreadLocal<DevStateInfo>();
	
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
	public int getMSI() {
		return MSI;
	}
	public void setMSI(int mSI) {
		MSI = mSI;
	}
	public int getLAC() {
		return LAC;
	}
	public void setLAC(int lAC) {
		LAC = lAC;
	}
	public int getCID() {
		return CID;
	}
	public void setCID(int cID) {
		CID = cID;
	}
	public int getDevCnt() {
		return devCnt;
	}
	public void setDevCnt(int devCnt) {
		this.devCnt = devCnt;
	}
	public List<DevInfo> getDevInfos() {
		return devInfos;
	}
	public void setDevInfos(List<DevInfo> devInfos) {
		this.devInfos = devInfos;
	}
	
	public Date getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time = new Date(time);
	}
	public static ThreadLocal<DevStateInfo> getTLRD() {
		return TLRD;
	}
	public static void setTLRD(ThreadLocal<DevStateInfo> tLRD) {
		TLRD = tLRD;
	}
	public static void clear() {
		TLRD.remove();
	}

	/**
	 * 获取当前可用的ResponseData对象
	 * @return
	 */
	public static <T> DevStateInfo getInstance() {
		DevStateInfo rd = TLRD.get();
		if (rd == null) {
			rd = new DevStateInfo();
			TLRD.set(rd);
		}
		return rd;
	}

	

	
	
}
