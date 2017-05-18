package com.smartcold.manage.cold.service.task;

import org.apache.log4j.Logger;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.jobs.taskutil.QuartzManager;
import com.smartcold.manage.cold.jobs.taskutil.ScheduleJob;
import com.smartcold.manage.cold.service.TempWarningService;
import com.smartcold.manage.cold.util.TimeUtil;
  
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QuartzJobFactory 
 * Create on MaQiang34 2017-5-11 15:06:34
 */ 
@Service
@DisallowConcurrentExecution  
public class QuartzJobFactory implements Job {  
    
	@Autowired
	private TempWarningService tempWarningServer;
	@Autowired
    private SysWarningsInfoMapper  sysWarningsInfoMapper;
	
	private static final Logger log = Logger.getLogger(QuartzJobFactory.class);  
    
    
    @Override  
    public void execute(JobExecutionContext context) throws JobExecutionException {  
        try {  
        	log.info("任务运行开始-------- start --------");  
        	System.err.println("=======================================");
            //ScheduleJob任务运行时具体参数，可自定义  
            int  key=(int) context.getMergedJobDataMap().get("sid");  
            ScheduleJob job = QuartzManager.getJob(key);
            if(job!=null){
            	ColdStorageSetEntity coldobj = job.getColdStorageSetEntity();
            	ItemValue minTempData = this.tempWarningServer.getMAITempData(coldobj.getId(), 1,coldobj.getDeviceid(),TimeUtil.getDateTime(job.getStartTime()), TimeUtil.getDateTime());//升溫后最小值
            	System.err.println("查询到最低温度："+minTempData.getValue());
            	
            }
        }catch (Exception e) {  
            log.info("捕获异常==="+e);  
        }  
        log.info("任务运行结束-------- end --------");   
    }  
}  
