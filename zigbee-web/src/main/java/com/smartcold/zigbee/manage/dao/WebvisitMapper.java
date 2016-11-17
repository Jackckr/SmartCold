package com.smartcold.zigbee.manage.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;



public interface WebvisitMapper {
	
	public void updateWebvisits(@Param("id")int id,@Param("value")int value); 
	
	public void addwebAcceslist(List<HashMap<String, Object>> list);
	
	public void addwebAcces(String ip,String sysinfo,String browinfo,String userinfo);
}
