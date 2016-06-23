package com.smartcold.zigbee.manage.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.AdminMapper;
import com.smartcold.zigbee.manage.dto.ResultDto;
import com.smartcold.zigbee.manage.entity.CookieEntity;
import com.smartcold.zigbee.manage.entity.AdminEntity;
import com.smartcold.zigbee.manage.service.CookieService;
/**
 * 
 *@author Kaiqiang Jiang
 *@date:2016-6-22 上午11:48:35
 *@Description: Admin login and logout & find admin & add admin
 */
@Controller
@RequestMapping(value = "/admin")
public class AdminController extends BaseController {

	@Autowired
	private AdminMapper adminDao;

	@Autowired
	private CookieService cookieService;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	@ResponseBody
	public Object login(HttpServletRequest request, String adminName, String adminPwd) {
		AdminEntity admin = adminDao.findAdmin(adminName, adminPwd);
		if (admin != null) {
			String cookie = cookieService.insertCookie(adminName);
			admin.setAdminpwd("******");
			request.getSession().setAttribute("admin", admin);
			return String.format("token=%s", cookie);
		}
		return false;
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request) {
		request.getSession().setAttribute("admin", null);
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("token")) {
				cookieService.deleteCookie(cookie.getValue());
			}
		}
		return true;
	}


	@RequestMapping(value = "/findAdminList", method = RequestMethod.GET)
	@ResponseBody
	public Object findAdminList() {
		return adminDao.findAllAdmin();
	}
	
	@RequestMapping(value = "/findAdmin", method = RequestMethod.GET)
	@ResponseBody
	public Object findAdmin(HttpServletRequest request) {
		AdminEntity admin;
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					CookieEntity effectiveCookie = cookieService
							.findEffectiveCookie(cookie.getValue());
					if (effectiveCookie != null) {
						admin = adminDao.findAdminByName(effectiveCookie
								.getUsername());
						admin.setAdminpwd("******");
						request.getSession().setAttribute("admin", admin);

						return admin;
					}
				}
			}

		}
		admin = new AdminEntity();

		return admin;
	}

	@RequestMapping(value = "/addAdmin", method = RequestMethod.POST)
	@ResponseBody
	public Object addAdmin(String adminname, String adminpwd,String adminpwd1, String email, String telephone) {
		if (adminname == null || adminpwd == null || !adminpwd.equals(adminpwd1)) {
			return new ResultDto(-1, "用户名和密码不能为空");
		}
		AdminEntity adminEntity = new AdminEntity();
		adminEntity.setAdminname(adminname);
		adminEntity.setAdminpwd(adminpwd);
		adminEntity.setEmail(email);
		adminEntity.setTelephone(telephone);
		adminDao.insertAdmin(adminEntity);
		return new ResultDto(0, "注册成功");
	}

}
