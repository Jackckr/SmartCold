package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;
import java.util.HashMap;

/*
 * 
 */
public class ConversionEntity {

	private int id         ;
	private int rdcId      ;
	private int oid        ;
	private int type       ;
	private String table       ;
	private String name       ;
	private String mapping      ;
	private Date addtime    ;
	private HashMap<String,String[]> unit;
	
	public ConversionEntity() {
		super();
	}
	public ConversionEntity(int rdcId, int type, String table, String name,
			String mapping) {
		super();
		this.rdcId = rdcId;
		this.type = type;
		this.table = table;
		this.name = name;
		this.mapping = mapping;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getRdcId() {
		return rdcId;
	}
	public void setRdcId(int rdcId) {
		this.rdcId = rdcId;
	}
	public int getOid() {
		return oid;
	}
	public void setOid(int oid) {
		this.oid = oid;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	
	public String getTable() {
		return table;
	}
	public void setTable(String table) {
		this.table = table;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMapping() {
		return mapping;
	}
	public void setMapping(String mapping) {
		this.mapping = mapping;
	}
	
	public HashMap<String, String[]> getUnit() {
		return unit;
	}
	public void setUnit(HashMap<String, String[]> unit) {
		this.unit = unit;
	}
	public Date getAddtime() {
		return addtime;
	}
	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

	
	
 
    
}
