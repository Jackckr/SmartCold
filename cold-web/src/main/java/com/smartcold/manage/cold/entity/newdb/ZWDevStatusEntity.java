package com.smartcold.manage.cold.entity.newdb;


/**
 * 北京中威数据对象接口
 * @author Administrator
 *
 */
public class ZWDevStatusEntity {
	 Object type;    //包的类型，0数据包 1状态包
	 String intapid;    //apid
     int	tinyintMSI;  //移动信号强度，0~10,10最高
	 int LAC;  //基站位置信息LAC
	 int CID;  //基站位置信息CI
	 Object devCnt; //dev的状态信息集合数
	 Object devinfo; //dev的相关状态信息，包括BU和BSI
	 Long time;  //状态上报时间
	public Object getType() {
		return type;
	}
	public void setType(Object type) {
		this.type = type;
	}
	public String getIntapid() {
		return intapid;
	}
	public void setIntapid(String intapid) {
		this.intapid = intapid;
	}
	public int getTinyintMSI() {
		return tinyintMSI;
	}
	public void setTinyintMSI(int tinyintMSI) {
		this.tinyintMSI = tinyintMSI;
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
	public Object getDevCnt() {
		return devCnt;
	}
	public void setDevCnt(Object devCnt) {
		this.devCnt = devCnt;
	}
	public Object getDevinfo() {
		return devinfo;
	}
	public void setDevinfo(Object devinfo) {
		this.devinfo = devinfo;
	}
	public Long getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time = time;
	}
	
	
}
