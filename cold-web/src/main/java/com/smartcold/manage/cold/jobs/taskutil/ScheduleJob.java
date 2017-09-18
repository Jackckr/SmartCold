package com.smartcold.manage.cold.jobs.taskutil;

import java.util.Date;

import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QuartzJobFactory 
 * Create on MaQiang34 2017-5-11 15:06:34
 */  

public class ScheduleJob {
	private int oid;
	private String group;
	private String name;
	private Long croStartTime;//任務启动时间
	private Long addTime;
	private int level;
	//附加值
	private int  warcount;//累计超温次数
    private boolean isTask;
    private Date startTime;//起始报警开始时间
    private Date endTime;//结束报警时间
	private ColdStorageSetEntity coldStorageSetEntity;
	
	public ScheduleJob() {
		super();
	}
	
	
	
	public ScheduleJob(int oid, String name, Date startTime) {
		super();
		this.oid = oid;
		this.name = name;
		this.startTime = startTime;
	}



	public ScheduleJob(int oid,String group, String name, Long croStartTime,Long addTime) {
		super();
		this.oid = oid;
		this.group = group;
		this.name = name;
		this.addTime=addTime;
		this.croStartTime = croStartTime;
	}
	
	
	
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
	    	this.level=level;
	}
	
	public void setOid(int oid) {
		this.oid = oid;
	}
	
	public int getOid() {
		return oid;
	}
	public String getGroup() {
		return group;
	}
	public void setGroup(String group) {
		this.group = group;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public Long getCroStartTime() {
		return croStartTime;
	}
	public void setCroStartTime(Long croStartTime) {
		this.croStartTime = croStartTime;
	}
	public int getWarcount() {
		return warcount;
	}
	public void setWarcount(int warcount) {
		this.warcount = warcount;
	}
	
//	public double getMinval() {
//		return minval;
//	}
//	public void setMinval(double minval) {
//		if(minval<this.minval){
//			this.minval = minval;
//		}
//	}
	public boolean isTask() {
		return isTask;
	}
	public void setTask(boolean isTask) {
		this.isTask = isTask;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
//	public Date getEndTime() {
//		return endTime;
//	}
//	public void setEndTime(Date endTime) {
//		this.endTime = endTime;
//	}
	public Long getAddTime() {
		return addTime;
	}
	public void setAddTime(Long addTime) {
		this.addTime = addTime;
	}
	public ColdStorageSetEntity getColdStorageSetEntity() {
		return coldStorageSetEntity;
	}
	public void setColdStorageSetEntity(ColdStorageSetEntity coldStorageSetEntity) {
		this.coldStorageSetEntity = coldStorageSetEntity;
	}



	public Date getEndTime() {
		return endTime;
	}



	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	
	
	
}
