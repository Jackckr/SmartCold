package com.smartcold.zigbee.manage.entity;

import java.io.Serializable;
import java.util.Date;

public class CookieEntity implements Serializable {


	private int id;

	private String cookie;

	private String username;

	private int expireTime;

	private Date addTime;

	private static final long serialVersionUID = 8607220598564329559L;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCookie() {
		return cookie;
	}

	public void setCookie(String cookie) {
		this.cookie = cookie;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getExpireTime() {
		return expireTime;
	}

	public void setExpireTime(int expireTime) {
		this.expireTime = expireTime;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
