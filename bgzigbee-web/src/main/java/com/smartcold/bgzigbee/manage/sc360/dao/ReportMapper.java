package com.smartcold.bgzigbee.manage.sc360.dao;

import java.util.HashMap;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Param;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: 冷库报表
 * Create on maqiang34 2016年11月4日15:51:19
 */
public interface ReportMapper {

	/**
	 * 查找有dev和PLC配置的信息
	 * @param keyword:
	 * @param type
	 * @return
	 */
    Page<HashMap<String, Object>> findDLRDCByFilter( @Param("type") Integer type, @Param("keyword") String keyword);
   
}