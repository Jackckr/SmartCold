package com.smartcold.manage.cold.entity.newdb;
public class MaintconFirma {
	private int id;
	private int rdcId;
	private int serverType;
	private double cost;
	private String starttime;
	private String endtime;
	private String phenomena;
	private String maintresult;
	private String note;
	private String addtime;

	
	
	public MaintconFirma() {
		super();
	}

	public MaintconFirma(int rdcId, int serverType, double cost,
			String starttime, String endtime, String phenomena,
			String maintresult, String note) {
		super();
		this.rdcId = rdcId;
		this.serverType = serverType;
		this.cost = cost;
		this.starttime = starttime;
		this.endtime = endtime;
		this.phenomena = phenomena;
		this.maintresult = maintresult;
		this.note = note;
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

	public int getServerType() {
		return serverType;
	}

	public void setServerType(int serverType) {
		this.serverType = serverType;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	public String getStarttime() {
		return starttime;
	}

	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}

	public String getEndtime() {
		return endtime;
	}

	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}

	public String getPhenomena() {
		return phenomena;
	}

	public void setPhenomena(String phenomena) {
		this.phenomena = phenomena;
	}

	public String getMaintresult() {
		return maintresult;
	}

	public void setMaintresult(String maintresult) {
		this.maintresult = maintresult;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getAddtime() {
		return addtime;
	}

	public void setAddtime(String addtime) {
		this.addtime = addtime;
	}

}
