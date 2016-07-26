package com.smartcold.manage.cold.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.UserMapper;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.entity.CookieEntity;
import com.smartcold.manage.cold.entity.Role;
import com.smartcold.manage.cold.entity.RoleUser;
import com.smartcold.manage.cold.entity.UserEntity;
import com.smartcold.manage.cold.service.CookieService;
import com.smartcold.manage.cold.service.RoleService;
import com.smartcold.manage.cold.service.RoleUserService;
import com.smartcold.manage.cold.service.UserService;

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
		UserEntity user = userService.getUserByNAndP(userName, password);
		if (user.getId() != 0) {
			String cookie = cookieService.insertCookie(userName);
			RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
			if(roleUser==null)return new ResultDto(0, "您没有权限登录该系统！若有疑问请联系管理员！");
			Role role = roleService.getRoleByRoleId(roleUser.getRoleid());
			user.setPassword("******");
			user.setRole(role.getId());
			request.getSession().setAttribute("user", user);
			response.addCookie(new Cookie("token", cookie));
			return new ResultDto(1, String.format("token=%s", cookie));
		}
		return new ResultDto(0, "用户名或密码错误！");
	}
	/*
	 * @SuppressWarnings({ "finally", "rawtypes", "unchecked" })
	 * 
	 * @RequestMapping(value = "/login",method = RequestMethod.GET)
	 * 
	 * @ResponseBody public ModelAndView login2(HttpServletRequest
	 * request,HttpServletResponse response, String userName, String
	 * password)throws Exception { ModelAndView mav = new ModelAndView();
	 * MappingJackson2JsonView view = new MappingJackson2JsonView(); Map map =
	 * new HashMap(); try{ UserEntity user =
	 * userService.getUserByNAndP(userName, password); if (user!=null) {
	 * RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId()); Role
	 * role = roleService.getRoleByRoleId(roleUser.getRoleid()); String roleName
	 * = role.getName(); CompanyUser compUser =
	 * companyUserService.getComUserByUserId(user.getId()); Company company =
	 * companyService.getCompByCompId(compUser.getCompanyid()); String
	 * companyName = company.getName(); ArrayList<Integer> rdcIdList = new
	 * ArrayList<Integer>(); if(compUser.getCompanyid()!=null) {
	 * List<CompanyRdc> compRdcList =
	 * companyRdcService.getCompRdcsByCompId(compUser.getCompanyid()); for(int
	 * i=0;i<compRdcList.size(); i++){
	 * rdcIdList.add(compRdcList.get(i).getRdcid()); } } //取得角色对应的权限
	 *//*
		 * List<Privilege> privList = new ArrayList<Privilege>();
		 * List<PrivilegeRole> privRoleList = privilegeRoleService
		 * .getPrivRoleByRoleId(roleUser.getRoleid()); for (int i = 0; i <
		 * privRoleList.size(); i++) { Privilege priv =
		 * privilegeService.getPrivByPrivId(privRoleList.get(i).getId());
		 * privList.add(priv); }
		 *//*
		 * user.setPassword("******"); HttpSession session =
		 * request.getSession(); user.setRole(role.getId());
		 * session.setAttribute("user", user); session.setAttribute("cookie",
		 * user); map.put("companyName", companyName); map.put("roleName",
		 * roleName); map.put("rdcIdList", rdcIdList); map.put("result",
		 * Boolean.TRUE); }else { map.put("result", Boolean.FALSE); }
		 * }catch(Exception e){ map.put("result", Boolean.FALSE);
		 * e.printStackTrace(); }finally{ view.setAttributesMap(map);
		 * mav.setView(view); return mav; } }
		 */

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
					RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
					Role role = roleService.getRoleByRoleId(roleUser.getRoleid());
					user.setPassword("******");
					user.setRole(role.getId());
					request.getSession().setAttribute("user", user);

					return user;
				}
			}
		}
		user = new UserEntity();

		return user;
	}
}
