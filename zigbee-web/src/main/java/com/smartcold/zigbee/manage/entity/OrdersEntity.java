package com.smartcold.zigbee.manage.entity;

import java.util.Date;
import java.util.List;

public class OrdersEntity {
	private int id;
	private String orderid;
	private String ordername;
	private int ownerid;
	private String ownername;
	private String ownertele;
	private int userid;
	private String username;
	private String usertele;
	private int shareinfoid;
	private int state;
	private int number;
	private Date generatetime;
	private  List<String> files;//图片组
	private String logo = "app/img/rdcHeader.jpg";// +FtpService.READ_URL+ logo
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getOrderid() {
		return orderid;
	}
	public void setOrderid(String orderid) {
		this.orderid = orderid;
	}
	public String getOrdername() {
		return ordername;
	}
	public void setOrdername(String ordername) {
		this.ordername = ordername;
	}
	public int getOwnerid() {
		return ownerid;
	}
	public void setOwnerid(int ownerid) {
		this.ownerid = ownerid;
	}
	public String getOwnername() {
		return ownername;
	}
	public void setOwnername(String ownername) {
		this.ownername = ownername;
	}
	public String getOwnertele() {
		return ownertele;
	}
	public void setOwnertele(String ownertele) {
		this.ownertele = ownertele;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getUsertele() {
		return usertele;
	}
	public void setUsertele(String usertele) {
		this.usertele = usertele;
	}
	public int getShareinfoid() {
		return shareinfoid;
	}
	public void setShareinfoid(int shareinfoid) {
		this.shareinfoid = shareinfoid;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public Date getGeneratetime() {
		return generatetime;
	}
	public void setGeneratetime(Date generatetime) {
		this.generatetime = generatetime;
	}
	public List<String> getFiles() {
		return files;
	}
	public void setFiles(List<String> files) {
		this.files = files;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = logo;
	}
	
}
