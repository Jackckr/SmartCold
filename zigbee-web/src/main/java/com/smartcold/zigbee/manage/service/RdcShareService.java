package com.smartcold.zigbee.manage.service;

import java.util.HashMap;
import java.util.Map;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:睿库共享
 * Create on MaQiang 2016-6-27 09:28:36
 */
public interface RdcShareService {
	  /**
	    * 获得商品共享信息
	    * @param filter
	    * @return
	    */
	   public PageInfo<RdcShareDTO> getSEGDList(int pageNum,int pageSize,Map<String, Object> parameters);
	   /**
	    * 获得配送共享信息
	    * @param filter
	    * @return
	    */
	   public PageInfo<RdcShareDTO> getSEPSList(int pageNum,int pageSize,Map<String, Object> parameters);
	   
		/**
		 * 获得共享信息
		 * @param pageNum
		 * @param pageSize
		 * @param filter
		 * @return
		 */
	  	public PageInfo<RdcShareDTO> getSERDCList(int pageNum,int pageSize,HashMap<String, Object> filter);
}
