package com.smartcold.zigbee.manage.service;

import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.smartcold.zigbee.manage.dto.RdcAddDTO;
import com.smartcold.zigbee.manage.dto.RdcDTO;
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.entity.RdcEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:13)
 */
public interface RdcService {

	public final Gson gson = new Gson();

	List<RdcEntity> findRdcList();

	List<RdcDTO> findAllRdcDtos();

	List<RdcAddDTO> findRDCDTOByRDCId(@RequestParam int rdcID);

	List<RdcEntityDTO> findRdcDTOList();
	
	boolean checkName(String name);

}
