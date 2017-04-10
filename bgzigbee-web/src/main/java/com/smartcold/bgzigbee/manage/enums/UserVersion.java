package com.smartcold.bgzigbee.manage.enums;

/**
 * Created by corly on 16-8-13.
 */
public enum UserVersion {
	//用户类型
	GENVERSION(0,  "普通用戶"),
	VIPVERSION(1,  "VIP"),
	//COLVERSON(1,  "360用户" )
	
	/**
	 * 版本类型
	 */
	MaintVERSION(2,  "维修版"),
	TEMPVERSION(3,  "温度版"),
    BASICVERSION(4,  "基本版"),
    WISEVERSION(5,  "聪慧版"),
    SMARTVERSION(6,  "智能版");
	

	private int type;
	private String desc;

	private UserVersion(int type,  String desc) {
		this.type = type;
		this.desc = desc;
	}

	
	public int getType() {
		return type;
	}

	public String getDesc() {
		return desc;
	}
	
	
}
