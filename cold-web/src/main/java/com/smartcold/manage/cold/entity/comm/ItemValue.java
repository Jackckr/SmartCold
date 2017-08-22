package com.smartcold.manage.cold.entity.comm;

import java.util.Date;

public class ItemValue {

	private int id;

	private String name;
	
	private double value;

	private Date addtime;
	
	
	public ItemValue() {
		super();
	}

	public ItemValue(int id, String name, double value) {
		super();
		this.id = id;
		this.name = name;
		this.value = value;
	}



	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
