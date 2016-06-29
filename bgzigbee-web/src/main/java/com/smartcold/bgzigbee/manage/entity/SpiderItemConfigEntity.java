package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

public class SpiderItemConfigEntity {

	private int id;

	private int type;

	private String columnkey;

	private String columnvalue;

	private Date addtime;

	private Date updatetime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getColumnkey() {
		return columnkey;
	}

	public void setColumnkey(String columnkey) {
		this.columnkey = columnkey;
	}

	public String getColumnvalue() {
		return columnvalue;
	}

	public void setColumnvalue(String columnvalue) {
		this.columnvalue = columnvalue;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

	public Date getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(Date updatetime) {
		this.updatetime = updatetime;
	}

}
