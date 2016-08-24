package com.smartcold.zigbee.manage.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.smartcold.zigbee.manage.dto.RdcEntityDTO;
import com.smartcold.zigbee.manage.dto.RdcShareDTO;
import com.smartcold.zigbee.manage.service.RdcService;
import com.smartcold.zigbee.manage.service.RdcShareService;

@Controller
@RequestMapping(value = "/UtilController")
public class UtilController   {

	
	@Autowired
	private RdcService rdcService;
	@Autowired
	private RdcShareService rdcShareService;
	
	/**
	 * 支持全文检索
	 * @param request
	 * @param keyword
	 * @return
	 */
	@RequestMapping(value = "/searchdata")
	@ResponseBody
	public Object searchdata(HttpServletRequest request,String provinceid,String keyword) {
		HashMap<String, Object> alldata=new HashMap<String, Object>();
		HashMap<String, Object> filter=new HashMap<String, Object>();
		filter.put("keyword", keyword);
		filter.put("provinceid", provinceid);
		PageInfo<RdcEntityDTO> rdcList = this.rdcService.getRDCList(1,10, filter);
		PageInfo<RdcShareDTO> sharList = this.rdcShareService.getSEListByRdcID(1, 10, filter);
		if(rdcList.getTotal()>0){alldata.put("rdc", rdcList);}
		if(sharList.getTotal()>0){alldata.put("shar", sharList);}
		return alldata;
	}
}
