package com.smartcold.manage.cold.service;

import java.util.HashMap;

import com.smartcold.manage.cold.entity.comm.ItemConf;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.olddb.ConversionEntity;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:协议 数中心：
 * 
 * Create on MaQiang 2016-6-25 09:28:36
 */
public interface RdcConfService {
	
	public ItemConf findRdcConfByDevId(String apID);
	
	public HashMap<String, ItemValue> getConfigByRdcId(String rdcId);
	
	public HashMap<String, ConversionEntity>  getConverByrdcId(String rdcId);
	
	
}