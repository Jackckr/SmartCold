package com.smartcold.bgzigbee.manage.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;



/**
 * 
 * @author maqiang34
 *
 */
public interface WebSiteVisitsMapper {
	
	//PLC數量
	public Integer getPLCCount();
	//DEV數量
	public Integer getDEVCount();
	//总访问量
	public Integer getVisits();
	//总用户数量
	public Integer getCountUsers();
	//本周增长数量
	public Integer getWRCount();
	//rdc总量
	public Integer getRSCount();
	// 模块访问量
	public List<HashMap<String, Object>> getModular();
     //独立访客（UV）  
	public Integer getAUVisits(@Param("startTime")String startTime,@Param("endTime")String endTime);
     //-网站浏览量（PV） 
	public Integer getPVVisits(@Param("startTime")String startTime,@Param("endTime")String endTime);
	//一周注冊量 
	public Integer  getEnrollments(@Param("startTime")String startTime,@Param("endTime")String endTime);
	//一周訪問量 
	public Integer getWeeklyVisits(@Param("startTime")String startTime,@Param("endTime")String endTime);
	
	
	
}
