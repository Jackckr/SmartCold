package com.smartcold.bgzigbee.manage.entity;

import java.util.List;


/**
 * ACL权限中心对象 Copyright 2016 CoderDream's Studio All right reserved. Creators
 * MaQiang Created on 2017年3月19日09:38:34
 */
public class ACLAdminNode {
	int id;
	String url;
	String icon;
	String token;
	String menuid;
	String menuname;
	private List<ACLAdminNode> child;
	
	public ACLAdminNode(String menuid,String icon,  String menuname) {
		super();
		this.icon = icon;
		this.menuid = menuid;
		this.menuname = menuname;
	}
	
	public ACLAdminNode( String menuid, String icon, String menuname,String url) {
		super();
		this.url = url;
		this.icon = icon;
		this.menuid = menuid;
		this.menuname = menuname;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getMenuid() {
		return menuid;
	}

	public void setMenuid(String menuid) {
		this.menuid = menuid;
	}

	public String getMenuname() {
		return menuname;
	}

	public void setMenuname(String menuname) {
		this.menuname = menuname;
	}

	public List<ACLAdminNode> getChild() {
		return child;
	}

	public void setChild(List<ACLAdminNode> child) {
		this.child = child;
	}

	
	
}
