package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class DFSDataCollectionEntity {

	private int oid;
	private String table;//指向映射表
	private String key;
	private Object value;
	private String time;//采集时间
	private Date addtime;
	

	public DFSDataCollectionEntity() {

	}
	
	public DFSDataCollectionEntity(int oid,String table, String key) {
		super();
		this.oid=oid;
		this.table = table;
		this.key = key;
	}

	public int getOid() {
		return oid;
	}

	public void setOid(int oid) {
		this.oid = oid;
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
