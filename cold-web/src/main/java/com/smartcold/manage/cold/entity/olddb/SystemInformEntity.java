package com.smartcold.manage.cold.entity.olddb;

public class SystemInformEntity {
	private int id;
	private int type;//0:通知, 1:告警
	private int stype;
	private Integer rdcid;
	private Integer uid;
	private int level;
	private int isread;
	private int state;
	private String tit;
	private String msg;
	private String addtime;

	
	public SystemInformEntity() {
		super();
	}

	public SystemInformEntity(int type,int stype, Integer rdcid, Integer uid, int level,int isread, int state, String tit,String msg) {
		super();
		this.type = type;
		this.stype = stype;
		this.rdcid = rdcid;
		this.uid = uid;
		this.level = level;
		this.isread = isread;
		this.state = state;
		this.msg = msg;
		this.tit=tit;
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

	public int getStype() {
		return stype;
	}

	public void setStype(int stype) {
		this.stype = stype;
	}

	public Integer getRdcid() {
		return rdcid;
	}

	public void setRdcid(Integer rdcid) {
		this.rdcid = rdcid;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public int getIsread() {
		return isread;
	}

	public void setIsread(int isread) {
		this.isread = isread;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getTit() {
		return tit;
	}

	public void setTit(String tit) {
		this.tit = tit;
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
