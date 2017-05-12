package com.smartcold.manage.cold.jobs.taskutil;

import java.util.Calendar;
import java.util.Date;

import org.apache.log4j.Logger;

import com.smartcold.manage.cold.util.TimeUtil;
  
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: LoadTask 
 * Create on MaQiang34 2017-5-11 15:06:34
 */ 
public class LoadTask {  
    private static final Logger log = Logger.getLogger("");  
    
	
	
    /** 
     * @param sendTime 发送时间  
     * @return 
     * @author qgw  
     * @date 2016年1月26日 下午3:39:13 ^_^ 
     */  
    public static boolean timerTask(long sendTime,long msgId) {  
    	String jobName=msgId+"_job";
        String cron = CronExpConversion.getQuartzTime(sendTime);//获得quartz时间表达式，此方法自己写 //Util.toString(sendTime) 
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
           
            return true;  
        } catch (Exception e) {  
            log.info("加载定时器错误："+e);  
            return false;  
        }  
    } 
    

}  