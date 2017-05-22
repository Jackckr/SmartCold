package com.smartcold.manage.cold.entity.comm;

import java.util.Date;

public class ItemValue {

	private int id;

	private double value;

	private Date addtime;
	
	
	public ItemValue() {
		super();
	}

	public ItemValue(int id, double value, Date addtime) {
		super();
		this.id = id;
		this.value = value;
		this.addtime = addtime;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

	
}
