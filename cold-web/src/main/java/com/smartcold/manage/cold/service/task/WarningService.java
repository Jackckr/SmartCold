package com.smartcold.manage.cold.service.task;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.dao.olddb.SpiderConfigMapper;
import com.smartcold.manage.cold.entity.newdb.SysWarningsInfo;
import com.smartcold.manage.cold.entity.newdb.WarningsInfo;
import com.smartcold.manage.cold.jobs.taskutil.ScheduleJob;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 告警监听（后期 python ）
 * Copyright (C) DCIS 版权所有 功能描述: ZsDevService Create on MaQiang
 * 2016年9月27日11:55:45
 * 数据存在重复（准备处理）
 * 
 **/
//@Service
public class WarningService  {
	 
	    @Autowired
	    private SysWarningsInfoMapper sysInfoMapper;
	    
	    @Autowired
	    private WarningsInfoMapper wInfoMapper;
	    @Autowired
	    private SpiderConfigMapper spiderConfigMapper;
	    
	
	    private static HashMap<Integer, List<ScheduleJob>> extdataHashMap=new HashMap<Integer, List<ScheduleJob>>();
	
	
	    @Scheduled(cron = "0 0 */1 * * ?")
	    public  void timer() {
	    	System.err.println("我执行了=====================================");
	    }
		
  /**
   * findWarningByTime
   */
       public void excute(){
    	   Date startTime = TimeUtil.getBeforeHOUR(1),endTime =  new Date();
    	   List<Integer> findAllConfig = spiderConfigMapper.findAllConfig();
    	   for (Integer rdcid : findAllConfig) {
    		   List<WarningsInfo> findWarningByTime = wInfoMapper.findWarningByTime(rdcid, startTime, endTime);
		   }
       }

}
