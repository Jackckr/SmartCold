package com.smartcold.manage.cold.service.impl;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.ColdStorageAnalysisMapper;
import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.PowerSetMapping;
import com.smartcold.manage.cold.dao.olddb.QuantitySetMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.WarningsLog;
import com.smartcold.manage.cold.entity.olddb.WarningMsgEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.MsgService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.service.WarningMintService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * Copyright (C) DCIS 版权所有 功能描述: MsgServiceimp Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class WarningMintServiceimp implements WarningMintService {

	
	@Autowired
	private QuantityMapper quantityMapper;
	@Autowired
	private WarningLogMapper warningLogMapper;
	
	public final static String [] ERRTYPE={"电压缺相","电流不平衡"};
	public final static String [] INFTYPE={"电压缺相","电流不平衡"};
	
	/**
	 * 半小时执行一次
	 * Task:检查AP
	 * stupe 1.检查哪些库进行关联配置 2.将配置对象放进线程池进行监听保护 StorageService-》findByTime
	 * 3.超过系统规定时间 ，发送短信通知。。
	 * 
	 */
	@Scheduled(cron = "0 0/30 * * * ?")
	public void checkColdSrotgSyErr() {
		boolean taskStatus = quantityMapper.updateTaskStatus(5);
		if(!taskStatus){return ;}
		long currentTime = System.currentTimeMillis() - 1800000;
		Date startTime = new Date(currentTime);
		Date endTime = new Date();
		
		
		
		
		
	}
	
}
