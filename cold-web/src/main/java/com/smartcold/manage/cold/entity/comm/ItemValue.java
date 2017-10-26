package com.smartcold.manage.cold.entity.comm;

import java.io.Serializable;
import java.util.Date;

public class ItemValue implements Cloneable,Serializable {

	/**
	 * 
	 */
	private int id;
	private String key;
	private String name;
	private String table;//指向映射表
	private Object value;
	private String time;//采集时间
	private Date addtime;
	private static final long serialVersionUID = -6385769548005386256L;
	
	
	public ItemValue() {
		super();
	}
	
	



	public ItemValue(String table,String key) {
		super();
		this.key = key;
		this.table = table;
	}


	public ItemValue(String name, double value) {
		super();
		this.name = name;
		this.value = value;
	}
	public ItemValue(int id, String table, String key) {
		super();
		this.id = id;
		this.key = key;
		this.table = table;
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

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTable() {
		return table;
	}

	public void setTable(String table) {
		this.table = table;
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
	
	public Object clone() {  
		ItemValue o = null;  
	        try {  
	            o = (ItemValue) super.clone();  
	        } catch (CloneNotSupportedException e) {  
	            e.printStackTrace();  
	        }  
	        return o;  
	}  

	
}
