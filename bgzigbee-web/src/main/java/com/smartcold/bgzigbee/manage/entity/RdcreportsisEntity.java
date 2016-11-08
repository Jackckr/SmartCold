package com.smartcold.bgzigbee.manage.entity;


public class RdcreportsisEntity {
	private Integer id;
	private Integer rdcId;
	private String rdcsis;
	private String chillersis;
	private String time;
	private String updateTime;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getRdcId() {
		return rdcId;
	}
	public void setRdcId(Integer rdcId) {
		this.rdcId = rdcId;
	}
	public String getRdcsis() {
		return rdcsis;
	}
	public void setRdcsis(String rdcsis) {
		this.rdcsis = rdcsis;
	}
	public String getChillersis() {
		return chillersis;
	}
	public void setChillersis(String chillersis) {
		this.chillersis = chillersis;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
}