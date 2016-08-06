package com.smartcold.zigbee.manage.entity;

import java.util.Date;

public class UserEntity {

	private int id;

	private int sex;//-> new add  0:保密-> 1:男->  2:女  

	private int role;
	
	private String email;
	
	private String username;

	private String password;

	private String telephone;
	
	private String realname;

	private int addressid;//-> new add 
	
	private String address;//-> new add:无意义，仅显示
	
	private int hometownid;//家乡->add
	
	private String hometown;//家乡->add:无意义，仅显示
	
	private Date addTime;

	private Date UpdateTime;

	private String avatar="app/img/userimg.jpg";//用户头像->add
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSex() {
		return sex;
	}

	public void setSex(int sex) {
		this.sex = sex;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
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

	public String getRealname() {
		return realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAvatar() {
		return this.avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

	public Date getUpdateTime() {
		return UpdateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.UpdateTime = updateTime;
	}

	public String getHometown() {
		return this.hometown;
	}

	public void setHometown(String hometown) {
		this.hometown = hometown;
	}

	public int getAddressid() {
		return addressid;
	}

	public void setAddressid(int addressid) {
		this.addressid = addressid;
	}

	public int getHometownid() {
		return hometownid;
	}

	public void setHometownid(int hometownid) {
		this.hometownid = hometownid;
	}

}
