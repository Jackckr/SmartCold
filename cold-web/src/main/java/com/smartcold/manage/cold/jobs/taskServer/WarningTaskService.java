package com.smartcold.manage.cold.jobs.taskServer;

import java.util.Date;

import org.apache.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.jobs.taskutil.CronExpConversion;
import com.smartcold.manage.cold.jobs.taskutil.QuartzJobFactory;
import com.smartcold.manage.cold.jobs.taskutil.QuartzManager;
import com.smartcold.manage.cold.jobs.taskutil.ScheduleJob;

/**
 * 告警服务
 * Copyright (C) DCIS 版权所有 功能描述: TempWarningService Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class WarningTaskService  {
	
	 private static final Logger log = Logger.getLogger(WarningTaskService.class);  
	/**
	 * 5分钟执行一次
	 * Task:检查数据是否执行报警 
	*/
     @Scheduled(cron="0 0/1 * * * ?")
	public void checkData() {
    	 long msgId=System.currentTimeMillis();
    	 String jobName=msgId+"_job";
    	 long sendTime=msgId+120000;
         String cron = CronExpConversion.getQuartzTime(sendTime);//2
         ScheduleJob job = new ScheduleJob();  
         job.setId( msgId);  
         job.setName(jobName );  
         job.setAddTime(new Date());
         job.setCroTime("");  
         job.setGroup("MY_JOBGROUP_NAME");  
         try {  
         	 if(sendTime <=System.currentTimeMillis() ) {//
                
         		 
              } else {
                  QuartzManager.removeJob(jobName);   //删除已有的定时任务 
                  QuartzManager.addJob(jobName, QuartzJobFactory.class, cron,job);  //添加定时任务 
              }
            
         } catch (Exception e) {  
             log.info("加载定时器错误："+e);  
         }  
	}
	
	
    
  
  
	
}
