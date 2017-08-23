package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemValue;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: UtilMapper 工具类,提供公共操作
 * Create on MaQiang34 2017-5-15 12:23:05
 */
public interface UtilMapper {
	
  public ItemValue	findObjByID(@Param("table") String table,@Param("id") int id );
  
  public List<ItemValue> findObjByRdcId(@Param("table") String table,@Param("rdcid") int rdcid );
  
  public List<ItemValue> findSObjByRdcId(@Param("ptable") String ptable,@Param("stable") String stable,@Param("colum") String colum,@Param("rdcid") int rdcid);
	
	
}
