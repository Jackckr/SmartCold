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
	
	/**
	 * 获得共享信息
	 * @param filter
	 * @return
	 */
   public Page<RdcShareDTO> getSERDCList(Map<String, Object> parameters);
}
