package com.smartcold.manage.cold.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.entity.olddb.CookieEntity;
import com.smartcold.manage.cold.entity.olddb.Role;
import com.smartcold.manage.cold.entity.olddb.RoleUser;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.CookieService;
import com.smartcold.manage.cold.service.RoleService;
import com.smartcold.manage.cold.service.RoleUserService;
import com.smartcold.manage.cold.service.UserService;
import com.smartcold.manage.cold.util.EncodeUtil;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserService userService;
	@Autowired
	private RoleService roleService;
	@Autowired
	private RoleUserService roleUserService;

	@Autowired
	private UserMapper userDao;

	@Autowired
	private CookieService cookieService;

	/**
	 * @param @param
	 *            userName
	 * @param @param
	 *            password
	 * @param @param
	 *            request
	 * @param @param
	 *            response
	 * @param @return
	 *            ModelAndView
	 * @param @throws
	 *            Exception
	 * @return true/false
	 * @throws @Title:
	 *             login UserController
	 * @Description: 用户登录
	 */
	@RequestMapping(value = "/login")
	@ResponseBody
	public Object login(HttpServletRequest request, String userName, String password, HttpServletResponse response) {
		// UserEntity user = userDao.findByPassword(userName, password);
		UserEntity user = userService.getUserByNAndP(userName, EncodeUtil.encodeByMD5(password));
		if (user.getId() != 0) {
			String cookie = cookieService.insertCookie(userName);
			RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
			if(roleUser==null)return new ResultDto(1, "您没有权限登录该系统！若有疑问请联系管理员！");
//			Role role = roleService.getRoleByRoleId(roleUser.getRoleid());
			user.setPassword(null);
			user.setRole(roleUser.getRoleid());
//			user.setType(roleUser.getType());
			request.getSession().setAttribute("user", user);
			response.addCookie(new Cookie("token", cookie));
			return new ResultDto(0, String.format("token=%s", cookie));
		}
		return new ResultDto(1, "用户名或密码错误！");
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
		UserEntity user = (UserEntity)request.getSession().getAttribute("user");
		if(user!=null){return user;}
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return new UserEntity();
		}
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("token")) {
				CookieEntity effectiveCookie = cookieService.findEffectiveCookie(cookie.getValue());
				if (effectiveCookie != null) {
					user = userDao.findUserByName(effectiveCookie.getUsername());
					if(user==null)return new UserEntity();
					RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
					if(roleUser!=null){
					  Role role = roleService.getRoleByRoleId(roleUser.getRoleid());
					  user.setRole(role.getId());
					}
					user.setPassword(null);
					request.getSession().setAttribute("user", user);
					return user;
				}
			}
		}
		user = new UserEntity();

		return user;
	}
}
