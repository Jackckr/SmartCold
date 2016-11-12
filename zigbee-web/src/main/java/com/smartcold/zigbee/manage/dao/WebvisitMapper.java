package com.smartcold.zigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;



public interface WebvisitMapper {

	public void updateWebvisitsList(List<int[]> list);
	
	public void updateWebvisits(@Param("id")int id,@Param("value")int value); 
}
