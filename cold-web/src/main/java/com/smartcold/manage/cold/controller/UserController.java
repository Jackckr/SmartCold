package com.smartcold.manage.cold.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.StringUtil;

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
	public Object login(HttpServletRequest request, HttpServletResponse response, String userName, String password) {
		if(StringUtil.isNull(userName)||StringUtil.isNull(password)){return new ResultDto(1, "用户名或密码错误！");}
		UserEntity user = userService.getUserByNAndP(userName, EncodeUtil.encodeByMD5(password));
		if (user.getId() != 0) {
			String cookie = cookieService.insertCookie(userName);
			RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
			request.getSession().setAttribute("user", user);
			response.addCookie(new Cookie("token", cookie));
			if(roleUser==null){//判断有没有申请
				
				return new ResultDto(2, String.format("token=%s", cookie));//未授权
//				return new ResultDto(3, String.format("token=%s", cookie));//未认证
			}
			user.setPassword(null);
			user.setRole(roleUser.getRoleid());
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
	
	
	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	@ResponseBody
	public Object signup(HttpServletRequest request,String username, String password,String telephone,String signUpCode) {
		try {
			if (StringUtil.isNull(username)||StringUtil.isNull(password)||StringUtil.isNull(telephone)||StringUtil.isNull(signUpCode)) {
				return  ResponseData.newFailure("请输入必填信息！");
			}
			UserEntity user = new UserEntity();
			user.setUsername(username);
			user.setPassword(EncodeUtil.encodeByMD5(password));
			user.setTelephone(telephone);
			userDao.insertUser(user);
			UserEntity userByName = userDao.findUserByName(username);
			HttpSession session = request.getSession();
			session.setAttribute("user",userByName);
			String cookie = cookieService.insertCookie(username);
			userByName.setPassword(null);
			return  ResponseData.newSuccess(String.format("token=%s", cookie));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ResponseData.newFailure("注册失败！请稍后重试！");
		
	}
	/**
	 * 检查用户名是否占用
	 * @param request true：表示当前用户名已存在或为null->不能注册
	 * @param userName
	 * @return
	 */
	@RequestMapping(value = "/existenceUserName")
	@ResponseBody
	public boolean existenceUserName(HttpServletRequest request,String userName){
		if(StringUtil.isNull(userName)){return false;}
	    return this.userDao.existenceUserName(userName)>0;
	}
}
