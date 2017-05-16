package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemObject;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: UtilMapper 工具类,提供公共操作
 * Create on MaQiang34 2017-5-15 12:23:05
 */
public interface UtilMapper {
	
  public ItemObject	findObjByID(@Param("table") String table,@Param("id") int id );
	
	
}
