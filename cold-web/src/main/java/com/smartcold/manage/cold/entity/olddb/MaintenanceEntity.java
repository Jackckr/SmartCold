package com.smartcold.manage.cold.entity.olddb;


public class MaintenanceEntity {

	private int id;
	
	private int rdcId;

	private String unitname;

	private String reason;

	private String detail;

	private String note;

	private String appraise;
	
	private int audit;
	
    private String ordertime;
    
    private String fixtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	public int getRdcId() {
		return rdcId;
	}

	public void setRdcId(int rdcId) {
		this.rdcId = rdcId;
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

	public String getOrdertime() {
		return ordertime;
	}

	public void setOrdertime(String ordertime) {
		this.ordertime = ordertime;
	}

	public String getFixtime() {
		return fixtime;
	}

	public void setFixtime(String fixtime) {
		this.fixtime = fixtime;
	}

	

    
}
