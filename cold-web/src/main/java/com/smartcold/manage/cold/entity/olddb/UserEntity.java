package com.smartcold.manage.cold.entity.olddb;

import java.io.Serializable;

public class UserEntity implements Serializable {

	private int id;

	private int role;//1 普通用户 2 集团用户 3 超级管理员
	private int roleid;//???==role 
	private int type;//0:360用户 1:货主  2 :服务商
	private int level;//0:管理员   1：低级管理员 2  3
	private String username;
	private String password;//管理员密码
	private String telephone;
	private String email;
//	private Integer vipType;
	//登录安全检查信息
	private String  token;//
	private String  systoke;//md5(token +pwd)
	private boolean loginRisk;//当前登录环境是否正常
	private String  lastlogininfo;//上的登录环境信息
	private String  cuttlogininfo;//本次登录环境信息
	
	private String avatar="http://139.196.189.93:8089/app/userimg.jpg";//用户头像->add
	
	private static final long serialVersionUID = -2875979349754314456L;
	
	public UserEntity() {
		super();
	}

	public UserEntity(int id, int type) {
		super();
		this.id = id;
		this.type = type;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

	public int getRoleid() {
		return roleid;
	}

	public void setRoleid(int roleid) {
		this.roleid = roleid;
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

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getSystoke() {
		return systoke;
	}

	public void setSystoke(String systoke) {
		this.systoke = systoke;
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

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}



	
	
	
}
