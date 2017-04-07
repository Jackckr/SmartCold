package com.smartcold.manage.cold.entity.newdb;

import java.util.List;

/**
 * ACL权限中心对象 Copyright 2016 CoderDream's Studio All right reserved. Creators
 * MaQiang Created on 2017年3月19日09:38:34
 */
public class ACLTreeNode {
	private int id;
	private int pid;
	private int mid;
	private int mpid;
	private String ioc;
	private String style;
	private String name;
	private String url;
	private String clickevent;
	private String tourl;
	private String controller;
	private String templateUrl;
	private boolean hasnode;
	private boolean acl;
	private String addtime;
	private List<ACLTreeNode> nodes;

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

	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	public int getMpid() {
		return mpid;
	}

	public void setMpid(int mpid) {
		this.mpid = mpid;
	}

	public String getIoc() {
		return ioc;
	}

	public void setIoc(String ioc) {
		this.ioc = ioc;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getClickevent() {
		return clickevent;
	}

	public void setClickevent(String clickevent) {
		this.clickevent = clickevent;
	}

	public String getTourl() {
		return tourl;
	}

	public void setTourl(String tourl) {
		this.tourl = tourl;
	}

	public String getController() {
		return controller;
	}

	public void setController(String controller) {
		this.controller = controller;
	}

	public String getTemplateUrl() {
		return templateUrl;
	}

	public void setTemplateUrl(String templateUrl) {
		this.templateUrl = templateUrl;
	}


	public boolean isAcl() {
		return acl;
	}

	public void setAcl(boolean acl) {
		this.acl = acl;
	}

	public boolean isHasnode() {
		return hasnode;
	}

	public void setHasnode(boolean hasnode) {
		this.hasnode = hasnode;
	}

	public String getAddtime() {
		return addtime;
	}

	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}

	public List<ACLTreeNode> getNodes() {
		return nodes;
	}

	public void setNodes(List<ACLTreeNode> nodes) {
		this.nodes = nodes;
	}

}
