package com.smartcold.bgzigbee.manage.entity;

import java.util.Date;
/**
 * 资讯类别实体类
 * @author jkq
 *
 */
public class InforCategoryEntity {
	private int id;
	private String categoryname;//分类名称
	private int orderid;//上级分类id
	private Date inserttime;//添加时间
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCategoryname() {
		return categoryname;
	}
	public void setCategoryname(String categoryname) {
		this.categoryname = categoryname;
	}
	public int getOrderid() {
		return orderid;
	}
	public void setOrderid(int orderid) {
		this.orderid = orderid;
	}
	public Date getInserttime() {
		return inserttime;
	}
	public void setInserttime(Date inserttime) {
		this.inserttime = inserttime;
	}
	
}
