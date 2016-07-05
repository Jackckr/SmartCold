package com.smartcold.zigbee.manage.dao;


import java.util.Map;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:睿库共享Mapp
 * Create on MaQiang 2016-6-27 09:28:36
 */
public interface RdcShareMapper {
	public int insert(String key);
	
	/**
	 * 发布消息
	 * @param rdcShareDTO
	 * @return
	 */
	public int addShareMsg(RdcShareDTO rdcShareDTO);
   /**
    * 获得商品共享信息
    * @param filter
    * @return
    */
   public Page<RdcShareDTO> getSEGDList(Map<String, Object> parameters);
   /**
    * 获得配送共享信息
    * @param filter
    * @return
    */
   public Page<RdcShareDTO> getSEPSList(Map<String, Object> parameters);
   
   /**
	 * 获得睿库共享信息
	 * @param filter
	 * @return
	 */
  public Page<RdcShareDTO> getSERDCList(Map<String, Object> parameters);
  
  
  
  
  
  
}
