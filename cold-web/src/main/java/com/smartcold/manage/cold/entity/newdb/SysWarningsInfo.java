package com.smartcold.manage.cold.entity.newdb;


public class SysWarningsInfo {

	private int id;
	private int rdcid;
	private int objid;
	private int type;
	private int level;
	private double longtime;
	private String warnigmsg;
	private String addtime;

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

	public int getObjid() {
		return objid;
	}

	public void setObjid(int objid) {
		this.objid = objid;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public double getLongtime() {
		return longtime;
	}

	public void setLongtime(double longtime) {
		this.longtime = longtime;
	}

	public String getWarnigmsg() {
		return warnigmsg;
	}

	public void setWarnigmsg(String warnigmsg) {
		this.warnigmsg = warnigmsg;
	}

	public String getAddtime() {
		return addtime;
	}

	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}

}
