package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

public class QuantityTask {
	private int	id                 ;
	private int	state              ;
	private int	intervalTime       ;
	private int	methodName         ;
	private Date	LastRunTim         ;
	private Date	updateTime         ;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public int getMethodName() {
		return methodName;
	}
	public void setMethodName(int methodName) {
		this.methodName = methodName;
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
