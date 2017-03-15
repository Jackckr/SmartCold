package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

/**
 * 队列任务
 * 
 * @author maqiang34
 * 
 */
public class TaskEntity {
	private int id;
	private int type;
	private int state;
	private int intervalTime;
	private String className;
	private String methodName;
	private String parameter;
	private String desc;
	private String exqip;
	private Date LastRunTim;
	private Date updateTime;

	public TaskEntity(){
		super();
	}
	public TaskEntity(int type, int state, int intervalTime, String className,	String methodName, String exqip) {
		super();
		this.type = type;
		this.state = state;
		this.intervalTime = intervalTime;
		this.className = className;
		this.methodName = methodName;
		this.exqip = exqip;
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

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public int getIntervalTime() {
		return intervalTime;
	}

	public void setIntervalTime(int intervalTime) {
		this.intervalTime = intervalTime;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getMethodName() {
		return methodName;
	}

	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}
	
	public String getParameter() {
		return parameter;
	}
	public void setParameter(String parameter) {
		this.parameter = parameter;
	}
	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getExqip() {
		return exqip;
	}

	public void setExqip(String exqip) {
		this.exqip = exqip;
	}

	public Date getLastRunTim() {
		return LastRunTim;
	}

	public void setLastRunTim(Date lastRunTim) {
		LastRunTim = lastRunTim;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

}
