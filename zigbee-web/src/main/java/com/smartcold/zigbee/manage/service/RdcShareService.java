package com.smartcold.zigbee.manage.service;

import java.util.HashMap;
import java.util.Map;

import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:睿库共享
 * Create on MaQiang 2016-6-27 09:28:36
 */
public interface RdcShareService {
	
	
	
	 /**
 	 * 获得修改共享信息详情
 	 * @param id
 	 * @return
 	 */
 	public RdcShareDTO getSEByIDForEdit(String id);
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
	public void delShareInfoByid(int id,int uid);
 	/**
 	 * 发布消息
 	 * @param rdcShareDTO
 	 * @return
 	 */ 
 	  public int addShareMsg(RdcShareDTO rdcShareDTO);
 	  /**
 	   * 更新发布消息
 	   * @param rdcShareDTO
 	   * @return
 	   */
 	  public int updateshareInfo(RdcShareDTO rdcShareDTO);
 	  /**
 	   * 获得关联库全部信息
 	   * @param filter
 	   * @return
 	   */
 	  public PageInfo<RdcShareDTO> getSEListByRdcID(int pageNum,int pageSize,Map<String, Object> parameters);
 	  /**
 	   * 获得睿库信息
 	   * @param filter
 	   * @return
 	   */
 	  public PageInfo<RdcShareDTO> getRdcList(int pageNum,int pageSize,Map<String, Object> parameters);

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


	    public PageInfo<RdcShareDTO> newGetSERDCList(int pageNum,int pageSize,HashMap<String, Object> filter);

	    /*发布信息时ios推送*/
	    void iOSPush(RdcShareDTO rdcShareDTO) throws Exception;
}
