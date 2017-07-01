package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;
import java.util.HashMap;

/*
 * 
 */
public class ConversionEntity {

	private int id         ;
	private int kv       ;
	private int type       ;
	private String oid        ;
	private String name       ;
	private String mapping      ;
	private Date addtime    ;
	private HashMap<String,String[]> unit;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public int getKv() {
		return kv;
	}
	public void setKv(int kv) {
		this.kv = kv;
	}
	public String getOid() {
		return oid;
	}
	public void setOid(String oid) {
		this.oid = oid;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
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
	public Date getAddtime() {
		return addtime;
	}
	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}
	public HashMap<String, String[]> getUnit() {
		return unit;
	}
	public void setUnit(HashMap<String, String[]> unit) {
		this.unit = unit;
	}
	
	
	
 
    
}
