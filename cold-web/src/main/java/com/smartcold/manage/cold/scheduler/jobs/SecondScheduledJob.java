/**
 * File Name：SecondScheduledJob.java
 *
 * Copyright Defonds Corporation 2015 
 * All Rights Reserved
 *
 */
package com.smartcold.manage.cold.scheduler.jobs;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

/**
 * 
 * Project Name：spring-quartz
 * Type Name：SecondScheduledJob
 * Type Description：
 * Author：Defonds
 * Create Date：2015-10-29
 * @version 
 * 
 */
public class SecondScheduledJob extends QuartzJobBean {

	@Override
	protected void executeInternal(JobExecutionContext arg0)throws JobExecutionException {
		System.out.println("I am SecondScheduledJob");

	}

}
