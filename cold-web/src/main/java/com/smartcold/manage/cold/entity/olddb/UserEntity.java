package com.smartcold.manage.cold.entity.olddb;

public class UserEntity {

	private int id;

	private int role;//1 普通用户 2 集团用户 3 超级管理员
	
	private int type;//0:360用户 1:货主  2 :服务商
	
	private String username;

	private String password;

	private String telephone;

	private String email;

	private Integer vipType;
	public UserEntity() {
		super();
	}

	public UserEntity(int id, int type) {
		super();
		this.id = id;
		this.type = type;
	}

	public UserEntity(int role, int type, String username,
			String password, String telephone, String email) {
		super();
		this.role = role;
		this.type = type;
		this.username = username;
		this.password = password;
		this.telephone = telephone;
		this.email = email;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public Integer getVipType() {
		return vipType;
	}

	public void setVipType(Integer vipType) {
		this.vipType = vipType;
	}
}
