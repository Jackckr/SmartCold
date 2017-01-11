package com.smartcold.manage.cold.entity.newdb;

import java.util.Date;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-03-19 11:54)
 */
public class GoodsColdStorageEntity {
	private int id;

	private int coldstorageid;

	private String goodsname;

	private int type;

	private float inputQuantity;

	private float outputQUantity;

	private float inputTemperature;

	private Date date;

	private Date addtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getColdstorageid() {
		return coldstorageid;
	}

	public void setColdstorageid(int coldstorageid) {
		this.coldstorageid = coldstorageid;
	}

	public String getGoodsname() {
		return goodsname;
	}

	public void setGoodsname(String goodsname) {
		this.goodsname = goodsname;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public float getInputQuantity() {
		return inputQuantity;
	}

	public void setInputQuantity(float inputQuantity) {
		this.inputQuantity = inputQuantity;
	}

	public float getOutputQUantity() {
		return outputQUantity;
	}

	public void setOutputQUantity(float outputQUantity) {
		this.outputQUantity = outputQUantity;
	}

	public float getInputTemperature() {
		return inputTemperature;
	}

	public void setInputTemperature(float inputTemperature) {
		this.inputTemperature = inputTemperature;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Date getAddtime() {
		return addtime;
	}

	public void setAddtime(Date addtime) {
		this.addtime = addtime;
	}

}
