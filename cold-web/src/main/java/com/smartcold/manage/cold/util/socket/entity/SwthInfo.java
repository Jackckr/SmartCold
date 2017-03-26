package com.smartcold.manage.cold.util.socket.entity;

import java.util.Date;

public class SwthInfo {
	private int devid;  //devid
	private int swth; //门开关 0关，1开
	private Date time; //门采集时间
	
	
	
	public SwthInfo() {
		super();
	}
	public SwthInfo(int devid, int swth, Long time) {
		super();
		this.devid = devid;
		this.swth = swth;
		this.time =new Date( time);
	}
	public int getDevid() {
		return devid;
	}
	public void setDevid(int devid) {
		this.devid = devid;
	}
	public int getSwth() {
		return swth;
	}
	public void setSwth(int swth) {
		this.swth = swth;
	}
	public Date getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time =new Date(time);
	}
	
	
	
}
