package com.smartcold.zigbee.manage.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.entity.CookieEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.CookieService;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;

	@Autowired
	private CookieService cookieService;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	@ResponseBody
	public Object login(HttpServletRequest request, String userName, String password) {
		UserEntity user = userDao.findUser(userName, password);
		if (user != null) {
			String cookie = cookieService.insertCookie(userName);
			user.setPassword("******");
			request.getSession().setAttribute("user", user);

			return String.format("token=%s", cookie);
		}
		return false;
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request) {
		request.getSession().setAttribute("user", null);
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("token")) {
				cookieService.deleteCookie(cookie.getValue());
			}
		}

		return true;
	}

	@RequestMapping(value = "/findUser", method = RequestMethod.GET)
	@ResponseBody
	public Object findUser(HttpServletRequest request) {
		UserEntity user;
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("token")) {
				CookieEntity effectiveCookie = cookieService.findEffectiveCookie(cookie.getValue());
				if (effectiveCookie != null) {
					user = userDao.findUserByName(effectiveCookie.getUsername());
					request.getSession().setAttribute("user", user);

					return user;
				}
			}
		}
		user = new UserEntity();

		return user;
	}

}
