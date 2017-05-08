/**
 * File Name：AnotherBean.java
 *
 * Copyright Defonds Corporation 2015 
 * All Rights Reserved
 *
 */
package com.smartcold.manage.cold.scheduler.jobs;

import org.springframework.stereotype.Component;

/**
 * 
 * Project Name：spring-quartz
 * Type Name：AnotherBean
 * Type Description：
 * Author：Defonds
 * Create Date：2015-10-29
 * @version 
 * 
 */
@Component("anotherBean")
public class AnotherBean {
     
    public void printAnotherMessage(){
        System.out.println("I am AnotherBean. I am called by Quartz jobBean using CronTriggerFactoryBean");
    }
     
}
