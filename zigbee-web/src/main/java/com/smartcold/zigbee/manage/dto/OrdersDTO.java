package com.smartcold.zigbee.manage.dto;

import java.util.List;

import com.smartcold.zigbee.manage.entity.OrdersEntity;

public class OrdersDTO {
	private OrdersEntity orders;
	private RdcShareDTO rsd;
	private String useraddress;
	private String owneraddress;
	private  List<String> files;//图片组
	private String logo = "app/img/rdcHeader.jpg";// +FtpService.READ_URL+ logo
	public OrdersEntity getOrders() {
		return orders;
	}
	public void setOrders(OrdersEntity orders) {
		this.orders = orders;
	}
	public RdcShareDTO getRsd() {
		return rsd;
	}
	public void setRsd(RdcShareDTO rsd) {
		this.rsd = rsd;
	}
	public String getUseraddress() {
		return useraddress;
	}
	public void setUseraddress(String useraddress) {
		this.useraddress = useraddress;
	}
	public String getOwneraddress() {
		return owneraddress;
	}
	public void setOwneraddress(String owneraddress) {
		this.owneraddress = owneraddress;
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
