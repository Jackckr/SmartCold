package com.smartcold.manage.cold.entity.newdb;

/**
 * ACL权限中心对象 Copyright 2016 CoderDream's Studio All right reserved. Creators
 * MaQiang Created on 2017年3月19日09:38:34
 */
public class ACLEntity {
	private int id;
	private int pid;
	private int gid;
	private int uid;
	private int rdcid;
	private int userid;
	private String name;
	private String nacl;
	private String unacl;
	private String rnacl;
	private String gnacl;

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

	public int getGid() {
		return gid;
	}

	public void setGid(int gid) {
		this.gid = gid;
	}

	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	public int getRdcid() {
		return rdcid;
	}

	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
	}

	public int getUserid() {
		return userid;
	}

	public void setUserid(int userid) {
		this.userid = userid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNacl() {
		return nacl;
	}

	public void setNacl(String nacl) {
		this.nacl = nacl;
	}

	public String getUnacl() {
		return unacl;
	}

	public void setUnacl(String unacl) {
		this.unacl = unacl;
	}

	public String getRnacl() {
		return rnacl;
	}

	public void setRnacl(String rnacl) {
		this.rnacl = rnacl;
	}

	public String getGnacl() {
		return gnacl;
	}

	public void setGnacl(String gnacl) {
		this.gnacl = gnacl;
	}

}
