package com.smartcold.zigbee.manage.entity;

import java.util.Date;

public class VisitLogEntity {

	private int id;

	private int visitpeoples;

	private Date addtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getVisitpeoples() {
		return visitpeoples;
	}

	public void setVisitpeoples(int visitpeoples) {
		this.visitpeoples = visitpeoples;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

}
