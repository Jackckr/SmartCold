package com.smartcold.manage.cold.entity.newdb;

public class MaintenanceInfo {
	private int id               ;
	private int rdcId;
	private String warmappid;
	private String faultmapper;
	private String note             ;
	private String repairtime       ;
	private String bookingtime      ;
	private Double cost             ;
	private String servertype             ;
	private Integer state            ;
	private String addtime          ;
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
	public String getWarmappid() {
		return warmappid;
	}
	public void setWarmappid(String warmappid) {
		this.warmappid = warmappid;
	}
	public String getFaultmapper() {
		return faultmapper;
	}
	public void setFaultmapper(String faultmapper) {
		this.faultmapper = faultmapper;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public String getRepairtime() {
		return repairtime;
	}
	public void setRepairtime(String repairtime) {
		this.repairtime = repairtime;
	}
	public String getBookingtime() {
		return bookingtime;
	}
	public void setBookingtime(String bookingtime) {
		this.bookingtime = bookingtime;
	}
	public Double getCost() {
		return cost;
	}
	public void setCost(Double cost) {
		this.cost = cost;
	}
	public String getServertype() {
		return servertype;
	}
	public void setServertype(String servertype) {
		this.servertype = servertype;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public String getAddtime() {
		return addtime;
	}
	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}
	
}
