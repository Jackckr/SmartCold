package com.smartcold.manage.cold.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/systemController")
public class SystemController extends BaseController {

	

	@RequestMapping(value = "/getVersion", method = RequestMethod.GET)
	@ResponseBody
	public String getVersion(HttpServletRequest request) {
			return "v-1。3.4";
	}
	




	
}
