package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;

/**
 * 
 *@author Kaiqiang Jiang
 *@date:2016-6-22 上午11:02:18
 *@Description: Admin Entity
 */
public class AdminEntity {
	private int id;
	private String adminname;
	private String adminpwd;
	private String telephone;
	private String email;
	private int type;//用户类型 0:设备服务商 1: 北京运营  2:上海应用部 3 管理员 4 超级管理员及开发人员
	private Integer role;//角色 1：查看 2查看，添加  3：查看，添加 删除，编辑 
	private String acl;//菜单权限
	private String token;//
	//登录安全检查信息
	private boolean loginRisk;//当前登录环境是否正常
	private String  lastlogininfo;//上的登录环境信息
	private String  cuttlogininfo;//本次登录环境信息
	
	private Date addtime;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAdminname() {
		return adminname;
	}
	public void setAdminname(String adminname) {
		this.adminname = adminname;
	}
	public String getAdminpwd() {
		return adminpwd;
	}
	public void setAdminpwd(String adminpwd) {
		this.adminpwd = adminpwd;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Date getAddtime() {
		return addtime;
	}
	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}
	public Integer getRole() {
		return role;
	}
	public void setRole(Integer role) {
		this.role = role;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public String getAcl() {
		return acl;
	}
	public void setAcl(String acl) {
		this.acl = acl;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public boolean isLoginRisk() {
		return loginRisk;
	}
	public void setLoginRisk(boolean loginRisk) {
		this.loginRisk = loginRisk;
	}
	public String getLastlogininfo() {
		return lastlogininfo;
	}
	public void setLastlogininfo(String lastlogininfo) {
		this.lastlogininfo = lastlogininfo;
	}
	public String getCuttlogininfo() {
		return cuttlogininfo;
	}
	public void setCuttlogininfo(String cuttlogininfo) {
		this.cuttlogininfo = cuttlogininfo;
	}

	
	
}
