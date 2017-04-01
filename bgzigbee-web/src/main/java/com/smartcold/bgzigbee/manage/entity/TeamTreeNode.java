package com.smartcold.bgzigbee.manage.entity;

import java.util.List;

/**
 * Copyright 2016 CoderDream's Studio All right reserved. Creators
 * MaQiang Created on 2017年3月19日09:38:34
 */
public class TeamTreeNode {
	private int id;
	private int pid;
	private int gid;
	private int type;
	private int rtype;
	private String icon;
	private String name;
	private boolean hastc=true;
	private boolean open=true;
	private boolean isParent=true;
	private List<TeamTreeNode> children;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPid() {
		return pid;
	}
	public void setPid(int pid) {
		this.pid = pid;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	
	public int getGid() {
		return gid;
	}
	
	public int getRtype() {
		return rtype;
	}
	public void setRtype(int rtype) {
		this.rtype = rtype;
	}
	public void setGid(int gid) {
		this.gid = gid;
	}
	public boolean isHastc() {
		return hastc;
	}
	public void setHastc(boolean hastc) {
		this.hastc = hastc;
	}
	
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public boolean isOpen() {
		return open;
	}
	public void setOpen(boolean open) {
		this.open = open;
	}
	public boolean isParent() {
		return isParent;
	}
	public void setParent(boolean isParent) {
		this.isParent = isParent;
	}
	public List<TeamTreeNode> getChildren() {
		return children;
	}
	public void setChildren(List<TeamTreeNode> children) {
		this.children = children;
	}
	
	
	

}
