package com.smartcold.manage.cold.controller;

import com.smartcold.manage.cold.service.CompressorBlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 23:04)
 */
@Controller
@RequestMapping(value = "/compressorBlower")
public class CompressorBlowerController {

	@Autowired
	private CompressorBlowerService compressorBlowerService;

	@RequestMapping(value = "/findByRdcId", method = RequestMethod.GET)
	@ResponseBody
	public Object findByRdcId(@RequestParam int rdcId) {
		return compressorBlowerService.findByRdcId(rdcId);
	}
}
