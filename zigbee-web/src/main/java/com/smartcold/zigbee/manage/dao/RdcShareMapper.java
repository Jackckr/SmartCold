package com.smartcold.zigbee.manage.dao;


import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:睿库共享Mapp
 * Create on MaQiang 2016-6-27 09:28:36
 */
public interface RdcShareMapper {
	
	
	/**
	 * 获得共享详情
	 * @param id
	 * @return
	 */
	public RdcShareDTO getSEByID(String id);
	/**
	 * 删除用户发布的信息
	 * @param id
	 * @param uid
	 */
	public void delShareInfoByid(@Param("id")int id,@Param("uid")int uid);
   /**
    * 发布消息
    * @param rdcShareDTO
    * @return
    */
   public int addshareInfo(RdcShareDTO rdcShareDTO);
    
   /**
    * 获得睿库信息
     * @param filter
    * @return
    */
	public Page<RdcShareDTO> getRdcList(Map<String, Object> parameters);
	
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
    
	 /**
	  * 获得关联库全部共享信息
	  * @param filter
	  * @return
	  */
	 public Page<RdcShareDTO> getSEListByRdcID(Map<String, Object> parameters);
    
  
  
  
}
