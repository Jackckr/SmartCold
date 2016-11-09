package com.smartcold.manage.cold.entity.olddb;

import java.util.Date;

public class MaintenanceEntity {

	private int id;

	private String unitname;

	private String reason;

	private String detail;

	private String note;

	private String appraise;
	
	private int audit;
	
    private Date ordertime;
    
    private Date fixtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUnitname() {
		return unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getAppraise() {
		return appraise;
	}

	public void setAppraise(String appraise) {
		this.appraise = appraise;
	}

	public int getAudit() {
		return audit;
	}

	public void setAudit(int audit) {
		this.audit = audit;
	}

	public Date getOrdertime() {
		return ordertime;
	}

	public void setOrdertime(Date ordertime) {
		this.ordertime = ordertime;
	}

	public Date getFixtime() {
		return fixtime;
	}

	public void setFixtime(Date fixtime) {
		this.fixtime = fixtime;
	}

    
}
