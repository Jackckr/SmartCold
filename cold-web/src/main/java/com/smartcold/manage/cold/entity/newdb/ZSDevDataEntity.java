package com.smartcold.manage.cold.entity.newdb;

import java.util.HashMap;

/**
 * 洲斯dev设备接口
 * @author Administrator
 *
 */
public class ZSDevDataEntity {
	private String devid;
	private HashMap<String, Object> datas;
	
	public String getDevid() {
		return devid;
	}
	public void setDevid(String devid) {
		this.devid = devid;
	}
	public HashMap<String, Object> getDatas() {
		return datas;
	}
	public void setDatas(HashMap<String, Object> datas) {
		this.datas = datas;
	}
	
	
	

}
