package com.smartcold.manage.cold.entity.newdb;


public class SysWarningsInfo {

	private int id;
	private int rdcid;
	private int objid;
	private int type;
	private int level;
	
	private double longtime;
	private String title;
	private String warnigmsg;
	private String addtime;
	private String endtime;
	private String starttime;
	private Double basTemp;
	private Double overTemp;
	private Float tempdiff;
	private String name;
	
	public SysWarningsInfo() {
		super();
	}

	public SysWarningsInfo(int rdcid, int objid, int type, int level,String starttime,String endtime,double longtime,double overTemp ,String title,String warnigmsg, String addtime,String name,Double basTemp,Float tempdiff) {
		super();
		this.rdcid = rdcid;
		this.objid = objid;
		this.type = type;
		this.level = level;
		this.longtime = longtime;
		this.title=title;
		this.warnigmsg = warnigmsg;
		this.addtime = addtime;
		this.starttime = starttime;
		this.endtime = endtime;
		this.name=name;
		this.basTemp=basTemp;
		this.overTemp=overTemp;
		this.tempdiff=tempdiff;
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

	public String getEndtime() {
		return endtime;
	}

	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}

	public String getStarttime() {
		return starttime;
	}

	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}

	public double getLongtime() {
		return longtime;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public Double getBasTemp() {
		return basTemp;
	}

	public void setBasTemp(Double basTemp) {
		this.basTemp = basTemp;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Float getTempdiff() {
		return tempdiff;
	}

	public void setTempdiff(Float tempdiff) {
		this.tempdiff = tempdiff;
	}

	public Double getOverTemp() {
		return overTemp;
	}

	public void setOverTemp(Double overTemp) {
		this.overTemp = overTemp;
	}
	
}
