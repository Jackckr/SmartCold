package com.smartcold.manage.cold.util.socket.entity;

import java.util.Date;

public class TempInfo {
	private int devid; // devid
	private float temp; // 温度
	private Date time; // 温度采集时间

	public TempInfo() {
		super();
	}

	public TempInfo(int devid, float temp, Long time) {
		super();
		this.devid = devid;
		this.temp = temp;
		this.time = new Date(time);
	}

	public int getDevid() {
		return devid;
	}

	public void setDevid(int devid) {
		this.devid = devid;
	}

	public float getTemp() {
		return temp;
	}

	public void setTemp(float temp) {
		this.temp = temp;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Long time) {
		this.time = new Date(time);
	}

}
