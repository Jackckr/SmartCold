package com.smartcold.bgzigbee.manage.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.StringUtil;
import com.smartcold.bgzigbee.manage.dao.RdcreportsisMapper;
import com.smartcold.bgzigbee.manage.entity.RdcreportsisEntity;
import com.smartcold.bgzigbee.manage.sc360.dao.ReportMapper;
import com.smartcold.bgzigbee.manage.util.ResponseData;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: 冷库报表
 * Create on maqiang34 2016年11月4日15:51:19
 */
@Controller
@RequestMapping(value = "/report")
public class ReportController extends BaseController {
    
	@Autowired
	private ReportMapper reportMapper;
	@Autowired
	private RdcreportsisMapper reportsisMapper;

	
	/**
	 * 获得月分析报表
	 * @param rdcId
	 * @param stTime
	 * @param edTime
	 * @return
	 */
	@RequestMapping(value = "/getRdcreportsis", method = RequestMethod.POST)
	@ResponseBody
	public Object getRdcreportsis(Integer rdcId,String stTime ,String edTime) {
		if(rdcId!=null&&StringUtil.isNotEmpty(stTime)&&StringUtil.isNotEmpty(edTime)){ 
			return this.reportsisMapper.getMothReportsisByrdcId(rdcId, stTime, edTime);}
		return null;
	}
	
	/**
	 * 保存分析报表
	 * @param rdcId
	 * @param stTime
	 * @param edTime
	 * @return
	 */
	@RequestMapping(value = "/saveRdcreportsis", method = RequestMethod.POST)
	@ResponseBody
	public ResponseData<String> saveRdcreportsis( RdcreportsisEntity sis) {
		if(sis!=null&&sis.getRdcId()!=null){ 
			if(sis.getId()!=null){
				this.reportsisMapper.updateRdcreportsis(sis);;
			}else if(sis.getRdcId()!=null){
				this.reportsisMapper.addRdcreportsis(sis);
			}
			return ResponseData.newSuccess();
		}
		return ResponseData.newFailure();
	}
	
	/**
	 * 获取可以分析的报表RDC信息
	 * @param pageNum
	 * @param pageSize
	 * @param keyword
	 * @return
	 */
	@RequestMapping(value = "/findDLRDCByFilter", method = RequestMethod.POST)
	@ResponseBody
	public Object findDLRDCByFilter(Integer pageNum, Integer pageSize, String keyword,String type) {
		    pageNum = pageNum == null? 1:pageNum;pageSize = pageSize==null? 10:pageSize;
		    PageHelper.startPage(pageNum, pageSize);
		    Page<HashMap<String, Object>> findDLRDCByFilter = this.reportMapper.findDLRDCByFilter(type,keyword);
		    return new PageInfo<HashMap<String, Object>>(findDLRDCByFilter);
	}
	
	
}
