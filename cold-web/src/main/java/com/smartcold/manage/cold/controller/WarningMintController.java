package com.smartcold.manage.cold.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.WarningMintMapper;
import com.smartcold.manage.cold.entity.newdb.WarningMintEntity;

@Controller
@RequestMapping(value = "/warningMint")
public class WarningMintController extends BaseController {
  
	@Autowired
	private WarningMintMapper warningMintMapper;
	
	@RequestMapping(value = "/getWarningMintByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public List<WarningMintEntity> getWarningMintByRdcId(int rdcId,Integer status,Integer level,String keyword){
		return this.warningMintMapper.getMaintAlarmByFilter(rdcId, status, level, keyword);
	}
	
	
}
