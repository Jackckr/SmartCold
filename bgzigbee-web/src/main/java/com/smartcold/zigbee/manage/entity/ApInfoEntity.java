package com.smartcold.zigbee.manage.entity;

import java.util.Date;

public class ApInfoEntity {

	private int id;

	private String apid;

	private String location;

	private Date addtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getApid() {
		return apid;
	}

	public void setApid(String apid) {
		this.apid = apid;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

}
