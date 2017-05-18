package com.smartcold.manage.cold.jobs.taskutil;

import java.util.Date;

import com.smartcold.manage.cold.entity.comm.ItemValue;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QuartzJobFactory 
 * Create on MaQiang34 2017-5-11 15:06:34
 */  
public class ScheduleJob {
	private Long id;
	private String group;
	private String name;
	private int type;
	private int level;
	private String croTime;
	private Date addTime;
	//附加值
	private double maxval;
    private double minval;
    private boolean isTask;
	private ItemValue minItem;
	private ItemValue maxItem;
	
	private int warcount;
	private Date startTime;//起始报警开始时间
	private Date endTime;//结束报警时间
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
	public String getCroTime() {
		return croTime;
	}
	public void setCroTime(String croTime) {
		this.croTime = croTime;
	}
	public Date getAddTime() {
		return addTime;
	}
	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

	
	
	
	public boolean isTask() {
		return isTask;
	}
	public void setTask(boolean isTask) {
		this.isTask = isTask;
	}
	public double getMaxval() {
		return maxval;
	}
	public void setMaxval(double maxval) {
		this.maxval = maxval;
	}
	public double getMinval() {
		return minval;
	}
	public void setMinval(double minval) {
		this.minval = minval;
	}
	public ItemValue getMinItem() {
		return minItem;
	}
	public void setMinItem(ItemValue minItem) {
		this.minItem = minItem;
	}
	public ItemValue getMaxItem() {
		return maxItem;
	}
	public void setMaxItem(ItemValue maxItem) {
		this.maxItem = maxItem;
	}
	public int getWarcount() {
		return warcount;
	}
	public void setWarcount(int warcount) {
		this.warcount = warcount;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	
}
