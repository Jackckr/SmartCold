package com.smartcold.zigbee.manage.entity;

/**
 * 全局消息已读标示类
 * @author kaiqiang jiang
 * @version 创建时间：2016-11-19 上午9:56:59
 *
 */
public class ComMessageReadEntity {
	private int id;
	private int commessageid;
	private int userid;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getCommessageid() {
		return commessageid;
	}
	public void setCommessageid(int commessageid) {
		this.commessageid = commessageid;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	
}
