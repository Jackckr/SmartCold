package com.smartcold.manage.cold.entity.newdb;


/**
 * 北京中威数据对象接口
 * @author Administrator
 *
 */
public class ZWDevDataEntity {
	private String devid;
	private Object type;    //包的类型，0数据包 1状态包 
    private String	intapid;    //apid
	private String smallintver; //版本 2表示2.0版，自定
	private Object  sensorType; //传感器设备类型，
	private Object sensorItemCnt;	//上报传感器数据集合数
    private Object tempinfo; //温度信息，指针数组，存放多个dev的温度数据                                     temp {intdevid;  //devidfloat temp; //温度int time； //温度采集时间}
	private Object swthinfo; //门信息，指针数组，存放多个dev的门数据                  swth {intdevid;  //devidtinyintswth; //门开关 0关，1开int time； //门采集时间} swthinfo;
	private Object pwcinfo; //电量信息，指针数组，存放多个dev的电量数据
	private Long time;  //ap上报时间戳
	public String getDevid() {
		return devid;
	}
	public void setDevid(String devid) {
		this.devid = devid;
	}
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
	public String getSmallintver() {
		return smallintver;
	}
	public void setSmallintver(String smallintver) {
		this.smallintver = smallintver;
	}
	public Object getSensorType() {
		return sensorType;
	}
	public void setSensorType(Object sensorType) {
		this.sensorType = sensorType;
	}
	public Object getSensorItemCnt() {
		return sensorItemCnt;
	}
	public void setSensorItemCnt(Object sensorItemCnt) {
		this.sensorItemCnt = sensorItemCnt;
	}
	public Object getTempinfo() {
		return tempinfo;
	}
	public void setTempinfo(Object tempinfo) {
		this.tempinfo = tempinfo;
	}
	public Object getSwthinfo() {
		return swthinfo;
	}
	public void setSwthinfo(Object swthinfo) {
		this.swthinfo = swthinfo;
	}
	public Object getPwcinfo() {
		return pwcinfo;
	}
	public void setPwcinfo(Object pwcinfo) {
		this.pwcinfo = pwcinfo;
	}
	public Long getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time = time;
	}
	
	
	
}
