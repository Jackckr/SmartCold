package com.smartcold.manage.cold.entity.newdb;

public class MaintenanceInfo {
	private int id               ;
	private String waruser          ;
	private String maintuser        ;
	private String companyinfo      ;
	private String note             ;
	private String repairtime       ;
	private String bookingtime      ;
	private String warMapper  ;
	private Double cost             ;
	private String servertype             ;
	private String warmappid           ;
	private Integer state            ;
	private String addtime          ;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getWaruser() {
		return waruser;
	}
	public void setWaruser(String waruser) {
		this.waruser = waruser;
	}
	public String getMaintuser() {
		return maintuser;
	}
	public void setMaintuser(String maintuser) {
		this.maintuser = maintuser;
	}
	public String getCompanyinfo() {
		return companyinfo;
	}
	public void setCompanyinfo(String companyinfo) {
		this.companyinfo = companyinfo;
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
	public String getWarMapper() {
		return warMapper;
	}
	public void setWarMapper(String warMapper) {
		this.warMapper = warMapper;
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

	public String getWarmappid() {
		return warmappid;
	}
	public void setWarmappid(String warmappid) {
		this.warmappid = warmappid;
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
