/**
 * File Name：ScheduledJob.java
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
 * Type Name：ScheduledJob
 * Type Description：
 * Author：Defonds
 * Create Date：2015-10-29
 * @version 
 * 
 */
public class FirstScheduledJob extends QuartzJobBean {
	
	private AnotherBean anotherBean;

	@Override
	protected void executeInternal(JobExecutionContext arg0)
			throws JobExecutionException {
		System.out.println("I am FirstScheduledJob");
		this.anotherBean.printAnotherMessage();

	}

	public void setAnotherBean(AnotherBean anotherBean) {
		this.anotherBean = anotherBean;
	}
}
