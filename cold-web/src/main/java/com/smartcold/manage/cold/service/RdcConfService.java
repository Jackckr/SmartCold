package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.entity.comm.ItemConf;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:协议 数中心：
 * 
 * Create on MaQiang 2016-6-25 09:28:36
 */
public interface RdcConfService {
	
	public ItemConf findRdcConfByDevId(String apID);
	
	public  void getConfigByRdcId(String rdcId);
	
	public void getConverByrdcId(String rdcId);
	
	
}