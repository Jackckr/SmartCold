package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

public class EvaporativeWaterSetEntity {

	private int id;

	private String name;

	private int evaporativeid;

	private String mapping;

	private Date addTime;

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

	public int getEvaporativeid() {
		return evaporativeid;
	}

	public void setEvaporativeid(int evaporativeid) {
		this.evaporativeid = evaporativeid;
	}

	public String getMapping() {
		return mapping;
	}

	public void setMapping(String mapping) {
		this.mapping = mapping;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}
}
