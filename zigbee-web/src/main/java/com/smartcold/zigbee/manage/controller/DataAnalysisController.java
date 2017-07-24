package com.smartcold.zigbee.manage.controller;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.DataAnalysisMapper;

@Controller
@RequestMapping(value = "/DataAnalysis")
public class DataAnalysisController {
	@Autowired
	private DataAnalysisMapper dataAnalysisMapper;

	@RequestMapping(value = "/getDataAnalysisBykey")
	@ResponseBody
	@Cacheable(value="DataAnalysisBykey")
	public Object getDataAnalysisBykey(int type,String key,Date startTime,Date endTime){
     	return   this.dataAnalysisMapper.getDataAnalysisBykey(type, key, startTime, endTime);
	}
	
}
