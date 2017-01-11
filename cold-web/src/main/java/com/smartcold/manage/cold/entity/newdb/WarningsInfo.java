package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class WarningsInfo {

	private int id;

	private String warningname;

	private int refrsysId;

	private int rdcId;

	private int objId;

	private int level;

	private Date addtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getWarningname() {
		return warningname;
	}

	public void setWarningname(String warningname) {
		this.warningname = warningname;
	}

	public int getRefrsysId() {
		return refrsysId;
	}

	public void setRefrsysId(int refrsysId) {
		this.refrsysId = refrsysId;
	}

	public int getRdcId() {
		return rdcId;
	}

	public void setRdcId(int rdcId) {
		this.rdcId = rdcId;
	}

	public int getObjId() {
		return objId;
	}

	public void setObjId(int objId) {
		this.objId = objId;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

}
