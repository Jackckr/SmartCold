package com.smartcold.manage.cold.entity.newdb;

public class MaintorderEntity {
	private int id          ;
	private int rdcId       ;
	private int maintid     ;
	private int wpid     ;
	private int wid      ;
	private int number      ;
	private int unit        ;
	private double price       ;
	private String addtime     ;
	
	public MaintorderEntity() {
		super();
	}

	public MaintorderEntity(int rdcId, int maintid, int wpid, int wid,
			int number, int unit, double price) {
		super();
		this.rdcId = rdcId;
		this.maintid = maintid;
		this.wpid = wpid;
		this.wid = wid;
		this.number = number;
		this.unit = unit;
		this.price = price;
	}

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
	public int getMaintid() {
		return maintid;
	}
	public void setMaintid(int maintid) {
		this.maintid = maintid;
	}

	public int getWpid() {
		return wpid;
	}

	public void setWpid(int wpid) {
		this.wpid = wpid;
	}

	public int getWid() {
		return wid;
	}

	public void setWid(int wid) {
		this.wid = wid;
	}

	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public int getUnit() {
		return unit;
	}
	public void setUnit(int unit) {
		this.unit = unit;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public String getAddtime() {
		return addtime;
	}
	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}

}
