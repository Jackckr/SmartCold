package com.smartcold.manage.cold.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.service.MsgService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * Copyright (C) DCIS 版权所有
 * 功能描述: MsgServiceimp
 * Create on MaQiang 2016年9月27日11:55:45
 **/
@Service
public  class MsgServiceimp implements MsgService {
	private static int count=0;
	
	@Autowired
	private RdcMapper rdcMapper;//  findRdcManger--rdcid 电话
	@Autowired
	private StorageService storageService;
	
	//Management
//
	/**stupe 1.检查哪些库进行关联配置
	 *       2.将配置对象放进线程池进行监听保护
	 *         StorageService-》findByTime
	 *       3.超过系统规定时间 ，发送短信通知。。
	 * 
	 */
//	@Scheduled(cron="0/5 * *  * * ? ")
	public void checkAPStatus() {
		List<Map<String, Object>> findRdcManger = this.rdcMapper.findRdcManger();//查找监听保护对象
		if(SetUtil.isnotNullList(findRdcManger)){
			System.err.println(TimeUtil.getDateTime()+"****1*********时间到了。。。我要开始工作了,"+count);
			count++;
		}
	
	}
	
}
