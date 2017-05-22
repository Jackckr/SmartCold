package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class DFSDataCollectionEntity {

	private int id;
	
	private String table;//指向映射表

	private String key;

	private Object value;

	private Date time;//采集时间

	private Date addtime;

	public DFSDataCollectionEntity() {

	}

	
	
	public DFSDataCollectionEntity(String table, String key, Object value,
			Date time, Date addtime) {
		super();
		this.table = table;
		this.key = key;
		this.value = value;
		this.time = time;
		this.addtime = addtime;
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

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}


}
