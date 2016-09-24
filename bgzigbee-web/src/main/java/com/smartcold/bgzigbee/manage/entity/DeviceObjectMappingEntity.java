package com.smartcold.bgzigbee.manage.entity;

/**
 * Created by corly on 16-8-20.
 */
public class DeviceObjectMappingEntity {
	private int id;
	private String deviceid;
	private int type;
	private int oid;
	private int rdcid;
	private int addtime;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDeviceid() {
		return deviceid;
	}

	public void setDeviceid(String deviceid) {
		this.deviceid = deviceid;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getOid() {
		return oid;
	}

	public void setOid(int oid) {
		this.oid = oid;
	}

	public int getRdcid() {
		return rdcid;
	}

	public void setRdcid(int rdcid) {
		this.rdcid = rdcid;
	}

	public int getAddtime() {
		return addtime;
	}

	public void setAddtime(int addtime) {
		this.addtime = addtime;
	}
}
