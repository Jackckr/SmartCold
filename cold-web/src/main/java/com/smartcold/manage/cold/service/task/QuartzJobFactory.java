package com.smartcold.manage.cold.service.task;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QuartzJobFactory 
 * Create on MaQiang34 2017-5-11 15:06:34
 *  * 仅238执行
 * 
 */
@DisallowConcurrentExecution
public class QuartzJobFactory implements Job {

	@Override
	public  void execute(JobExecutionContext context)throws JobExecutionException {
		WarningTaskService.addExtsid((int) context.getMergedJobDataMap().get("sid"));	//加入执行集合	
	}

	
}
