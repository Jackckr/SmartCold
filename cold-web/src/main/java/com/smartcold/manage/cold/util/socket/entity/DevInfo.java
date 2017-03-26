package com.smartcold.manage.cold.util.socket.entity;

import java.io.Serializable;
import java.util.Date;

public class DevInfo  implements Serializable {
	private int devid;    //apid
	private int BSI; //dev信号强度，0~10,10最强
	private float SU;  //dev电压值
	private Date time;  //传输时间
	private static final long serialVersionUID = 1L;
	
	
	public DevInfo() {
		super();
	}
	public DevInfo(int devid, int bSI, float sU, long time) {
		super();
		this.devid = devid;
		BSI = bSI;
		SU = sU;
		this.time = new Date(time);
	}
	public int getDevid() {
		return devid;
	}
	public void setDevid(int devid) {
		this.devid = devid;
	}
	public int getBSI() {
		return BSI;
	}
	public void setBSI(int bSI) {
		BSI = bSI;
	}
	public float getSU() {
		return SU;
	}
	public void setSU(float sU) {
		SU = sU;
	}
	public Date getTime() {
		return time;
	}
	public void setTime(Date time) {
		this.time = time;
	}
	
}
