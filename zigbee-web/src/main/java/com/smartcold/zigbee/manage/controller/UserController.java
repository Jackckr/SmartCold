package com.smartcold.zigbee.manage.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.entity.UserEntity;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	@ResponseBody
	public Object login(HttpServletRequest request, String userName, String password) {
		UserEntity user = userDao.findUser(userName, password);
		if (user != null) {
			user.setPassword("******");
			request.getSession().setAttribute("user", user);
			request.getSession().setAttribute("cookie", user);
			return true;
		}
		return false;
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request) {
		request.getSession().setAttribute("user", null);
		return true;
	}

	@RequestMapping(value = "/findUser", method = RequestMethod.GET)
	@ResponseBody
	public Object findUser(HttpServletRequest request) {
		UserEntity user = (UserEntity) request.getSession().getAttribute("user");
		if (user == null) {
			user = new UserEntity();
		}
		return user;
	}
}
