package com.smartcold.manage.cold.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.BlowerMapper;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;

/**
 * 体检Controller
 * 
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/PhysicalExamController")
public class PhysicalExamController {

	
	
	@Autowired
	private ColdStorageAnalysisService coldStorageAnalysisService;

	/**
	 * 根据rdcid体检
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/checkup")
	@ResponseBody
	public Object checkup(Integer rdcId) {
		return null;
	}

	

}
