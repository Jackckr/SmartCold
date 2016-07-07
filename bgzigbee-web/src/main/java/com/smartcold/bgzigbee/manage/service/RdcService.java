package com.smartcold.bgzigbee.manage.service;

import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;

import com.github.pagehelper.PageInfo;
import com.google.gson.Gson;
import com.smartcold.bgzigbee.manage.dto.RdcAddDTO;
import com.smartcold.bgzigbee.manage.dto.RdcDTO;
import com.smartcold.bgzigbee.manage.dto.RdcEntityDTO;
import com.smartcold.bgzigbee.manage.entity.RdcEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:13)
 */
public interface RdcService {

	public final Gson gson = new Gson();

	List<RdcEntity> findRdcList();

	List<RdcDTO> findAllRdcDtos();

	List<RdcAddDTO> findRDCDTOByRDCId(@RequestParam int rdcID);

	PageInfo<RdcEntityDTO> findRdcDTOByPage(int pageNum, int pageSize, Integer audit, String keyword);
	
	boolean deleteByRdcId(int rdcID);
	
	boolean isNameUnique(String name);

}
