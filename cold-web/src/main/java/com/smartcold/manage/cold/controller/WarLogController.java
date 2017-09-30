package com.smartcold.manage.cold.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;

/**
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/warlog")
@Deprecated
public class WarLogController extends BaseController {
	@Autowired
	private WarningLogMapper warningLogMapper;
	@Autowired
	private WarningsInfoMapper warningsInfoMapper;

	@RequestMapping(value = "/findWarningLogsByRdcID", method = RequestMethod.GET)
	@ResponseBody
	@Deprecated
	public Object findWarningLogsByRdcID(@RequestParam int rdcId) {
		return warningLogMapper.findAllWarningLog(rdcId);
	}
	
	@RequestMapping(value = "/getWarningInfoByRdcID", method = RequestMethod.GET)
	@ResponseBody
	@Deprecated
	public Object getWarningInfoByRdcID(@RequestParam int rdcId) {
		HashMap<String, Object> alldataMapp=new HashMap<String, Object>();
		alldataMapp.put("warLog",this.warningLogMapper.findAllWarningLog(rdcId));
		alldataMapp.put("warInfo", this.warningsInfoMapper.findLastNWarningInfo(rdcId, 100));
		return alldataMapp;
	}
	
}

