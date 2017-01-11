package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;

/**
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/warlog")
public class WarLogController extends BaseController {
	@Autowired
	private WarningLogMapper warningLogMapper;

	@RequestMapping(value = "/findWarningLogsByRdcID", method = RequestMethod.GET)
	@ResponseBody
	public Object findWarningLogsByRdcID(@RequestParam int rdcId) {
		return warningLogMapper.findAllWarningLog(rdcId);
	}
	
}

