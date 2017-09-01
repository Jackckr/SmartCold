package com.smartcold.zigbee.manage.entity;

import java.io.Serializable;
import java.util.Date;

import com.smartcold.zigbee.manage.service.FtpService;

public class UserEntity implements Serializable{

	private int id;

	private Integer role;
	
	private Integer roleid;
	
	private Integer type;
	
	private String email;
	
	private String nickname;//-> new add  昵称
	
	private String username;

	private String password;

	private String telephone;
	
	private String realname;
	
	private Integer sex;//-> new add  0:保密-> 1:男->  2:女 

	private Integer addressid;//-> new add 
	
	private String address;//-> new add:无意义，仅显示
	
	private Integer hometownid;//家乡->add
	
	private String hometown;//家乡->add:无意义，仅显示

	private String idCard;//身份证号

	private String companyName;//用户企业名
	
	private Date addTime;

	private Date UpdateTime;

	private String avatar="http://139.196.189.93:8089/app/userimg.jpg";//用户头像->add

	private Integer vipType;
	public UserEntity(){}

	public UserEntity(int id, Integer type) {
		this.id = id;
		this.type = type;
	}

	public int getId() {
		return id;
	}

	public Integer getRoleid() {
		return roleid;
	}

	public void setRoleid(Integer roleid) {
		this.roleid = roleid;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getRole() {
		return role;
	}

	public void setRole(Integer role) {
		this.role = role;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
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

	public String getRealname() {
		return realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public Integer getSex() {
		return sex;
	}

	public void setSex(Integer sex) {
		this.sex = sex;
	}

	public Integer getAddressid() {
		return addressid;
	}

	public void setAddressid(Integer addressid) {
		this.addressid = addressid;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Integer getHometownid() {
		return hometownid;
	}

	public void setHometownid(Integer hometownid) {
		this.hometownid = hometownid;
	}

	public String getHometown() {
		return hometown;
	}

	public void setHometown(String hometown) {
		this.hometown = hometown;
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
		UpdateTime = updateTime;
	}

	public String getAvatar() {
		return  this.avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar =  avatar;
	}

	public Integer getVipType() {
		return vipType;
	}

	public void setVipType(Integer vipType) {
		this.vipType = vipType;
	}

	public String getIdCard() {
		return idCard;
	}

	public void setIdCard(String idCard) {
		this.idCard = idCard;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
}
