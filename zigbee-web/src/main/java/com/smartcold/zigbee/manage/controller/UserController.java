package com.smartcold.zigbee.manage.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.dto.ResultDto;
import com.smartcold.zigbee.manage.entity.CookieEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.CookieService;
import com.smartcold.zigbee.manage.util.TelephoneVerifyUtil;
import com.taobao.api.ApiException;

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
		UserEntity user = (UserEntity)request.getSession().getAttribute("user");
		if(user!=null){return user;}
		Cookie[] cookies = request.getCookies();
		if(cookies!=null&&cookies.length>0){
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					CookieEntity effectiveCookie = cookieService.findEffectiveCookie(cookie.getValue());
					if (effectiveCookie != null) {
						user = userDao.findUserByName(effectiveCookie.getUsername());
						user.setPassword("******");
						request.getSession().setAttribute("user", user);
						return user;
					}
				}
			}
		}
		user = new UserEntity();
		return user;
	}

	@RequestMapping(value = "/userNameVerify", method = RequestMethod.POST)
	@ResponseBody
	public Object userNameVerify(HttpServletRequest request, String username) throws ApiException {
		if(userDao.findUserByName(username)==null)
			return true;
		return false;
	}

	
	@RequestMapping(value = "/telephoneVerify", method = RequestMethod.POST)
	@ResponseBody
	public Object telephoneVerify(HttpServletRequest request, String telephone) throws ApiException {
		if(telephone!=null&&!telephone.equals("")){
			TelephoneVerifyUtil teleVerify = new TelephoneVerifyUtil();
			String signUpCode = teleVerify.signUpVerify(telephone);
			request.getSession().setAttribute("signUpCode", signUpCode);
			return new ResultDto(0, "验证码已发送");
		}
		return new ResultDto(-1, "请填写手机号");
	}
	
	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	@ResponseBody
	public Object signup(HttpServletRequest request,String username, String password,String password1, String email,String telephone,String signUpCode) throws ApiException {
		if (username == null || password == null || !password.equals(password1)) {
			return new ResultDto(-1, "用户名和密码不能为空");
		}
		if(signUpCode==null||!signUpCode.equals(request.getSession().getAttribute("signUpCode")))
			return new ResultDto(-1, "验证码输入错误");
		UserEntity userEntity = new UserEntity();
		userEntity.setUsername(username);
		userEntity.setPassword(password);
		userEntity.setEmail(email);
		userDao.insertUser(userEntity);
		return new ResultDto(0, "注册成功");
	}

}
