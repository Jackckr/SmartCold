package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class ColdStorageAnalysisEntity {

	private int id;
	  
	private int type;
	  
	private int oid;
	  
	private String key;
	  
	private double value;
	  
	private Date date;
	  
	private Date updatetime;

	public ColdStorageAnalysisEntity(){
		
	}
	
	public ColdStorageAnalysisEntity(int type, int oid, String key,
			double value, Date date) {
		super();
		this.type = type;
		this.oid = oid;
		this.key = key;
		this.value = value;
		this.date = date;
	}



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

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Date getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(Date updatetime) {
		this.updatetime = updatetime;
	}
}
