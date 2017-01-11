package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class WarningsLog {

	private int id;
	private int rdcid;
	private int oid;
	private String msg;
	private String addtime;
	
	public WarningsLog() {
		super();
	}
	public WarningsLog(int rdcid, int oid, String msg) {
		super();
		this.rdcid = rdcid;
		this.oid = oid;
		this.msg = msg;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getRdcid() {
		return rdcid;
	}
	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
	}
	public int getOid() {
		return oid;
	}
	public void setOid(int oid) {
		this.oid = oid;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getAddtime() {
		return addtime;
	}
	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}
	
	
}
