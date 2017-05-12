package com.smartcold.manage.cold.jobs.taskutil;

import java.util.Date;
import java.util.List;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QuartzJobFactory 
 * Create on MaQiang34 2017-5-11 15:06:34
 */  
public class ScheduleJob {
	private Long id;
	private String group;
	private String name;
	private String desc;
	private int type;
	private int level;
	private List<String> devidList;
	private String croTime;
	private Date addTime;

	

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

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
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
	

}
