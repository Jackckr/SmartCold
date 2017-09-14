package com.smartcold.manage.cold.controller;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


/**
 * 风幕机windScreen
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/route")
public class RouteController {

	@RequestMapping(value = "/sx", method = RequestMethod.GET)
	public Object sx(HttpSession session) {
		session.setAttribute("logincss", "sx.css");
		session.setAttribute("company","1,松下技术服务有限公司,上海市普陀区");
		return "../../login.jsp";
	}
	@RequestMapping(value = "/yl", method = RequestMethod.GET)
	public Object yl(HttpSession session) {
		session.setAttribute("logincss", "yl.css");
		session.setAttribute("company", "2,逸利服务有限公司,上海市普陀区");
		return "../../login.jsp";
	}
	
	@RequestMapping(value = "/ml", method = RequestMethod.GET)
	public Object ml(HttpSession session) {
//		session.setAttribute("logincss", "yl.css");
//		session.setAttribute("company", "2,逸利服务有限公司,上海市普陀区");
		return "../../main.jsp";
	}
}
