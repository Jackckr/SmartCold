package com.smartcold.manage.cold.entity.comm;

import java.util.Date;

public class ItemValue {

	private int id;
	
	private int oid;

	private String key;
	
	private double value;

	private Date time;
	
	private Date addtime;
	

	public ItemValue() {
		super();
	}

	
	public ItemValue(int oid, String key, double value, Date time) {
		super();
		this.oid = oid;
		this.key = key;
		this.value = value;
		this.time = time;
	}



	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public int getOid() {
		return oid;
	}


	public void setOid(int oid) {
		this.oid = oid;
	}


	public String getKey() {
		return key;
	}


	public void setKey(String key) {
		this.key = key;
	}


	public double getValue() {
		return value;
	}


	public void setValue(double value) {
		this.value = value;
	}


	public Date getTime() {
		return time;
	}


	public void setTime(Date time) {
		this.time = time;
	}


	public Date getAddtime() {
		return addtime;
	}


	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}
	
}
