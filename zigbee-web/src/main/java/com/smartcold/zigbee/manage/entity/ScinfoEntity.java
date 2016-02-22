package com.smartcold.zigbee.manage.entity;

import java.util.Date;

public class ScinfoEntity {

	private int id;

	private String key;

	private int deviceid;

	private float info1;

	private float info2;

	private float info3;

	private float info4;

	private int type;

	private Date addtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public int getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(int deviceid) {
		this.deviceid = deviceid;
	}

	public float getInfo1() {
		return info1;
	}

	public void setInfo1(float info1) {
		this.info1 = info1;
	}

	public float getInfo2() {
		return info2;
	}

	public void setInfo2(float info2) {
		this.info2 = info2;
	}

	public float getInfo3() {
		return info3;
	}

	public void setInfo3(float info3) {
		this.info3 = info3;
	}

	public float getInfo4() {
		return info4;
	}

	public void setInfo4(float info4) {
		this.info4 = info4;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

}
