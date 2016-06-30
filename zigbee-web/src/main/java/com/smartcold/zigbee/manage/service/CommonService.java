package com.smartcold.zigbee.manage.service;

import java.util.List;
import java.util.Map;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类->为前天提供数据
 * Create on MaQiang 2016-6-27 09:28:36
 */
public interface CommonService {
	
	 List<Map<String, Object>> getCommData(String codetype);

	 List<Map<String, Object>> getBaseData(String table,String code,String value);
	 
}
