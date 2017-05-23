package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class DFSDataCollectionEntity {

	private int id;
	
	private String table;//指向映射表

	private String key;

	private Object value;

	private String time;//采集时间

	private Date addtime;

	public DFSDataCollectionEntity() {

	}

	
	
	public DFSDataCollectionEntity(int id,String table, String key) {
		super();
		this.id=id;
		this.table = table;
		this.key = key;
	}


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTable() {
		return table;
	}

	public void setTable(String table) {
		this.table = table;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}



	public String getTime() {
		return time;
	}



	public void setTime(String time) {
		this.time = time;
	}



	public Date getAddtime() {
		return addtime;
	}



	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}




}
