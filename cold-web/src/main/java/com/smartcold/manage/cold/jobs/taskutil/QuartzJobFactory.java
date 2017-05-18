package com.smartcold.manage.cold.jobs.taskutil;

import org.apache.log4j.Logger;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
  
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QuartzJobFactory 
 * Create on MaQiang34 2017-5-11 15:06:34
 */ 

@DisallowConcurrentExecution  
public class QuartzJobFactory implements Job {  
    private static final Logger log = Logger.getLogger(QuartzJobFactory.class);  
    
    @Override  
    public void execute(JobExecutionContext context) throws JobExecutionException {  
        try {  
        	log.info("任务运行开始-------- start --------");  
        	System.err.println("=======================================");
            //ScheduleJob任务运行时具体参数，可自定义  
            int  oid=(int) context.getMergedJobDataMap().get("sid");  
           
            
            
        }catch (Exception e) {  
            log.info("捕获异常==="+e);  
        }  
        log.info("任务运行结束-------- end --------");   
    }  
}  
