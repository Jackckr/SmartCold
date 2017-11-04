package com.smartcold.manage.cold.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.UserService;
import com.smartcold.manage.cold.service.redis.CacheService;
import com.smartcold.manage.cold.util.EncodeUtil;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserService userService;
	@Autowired
	private CacheService cahcCacheService;
	

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request,String token) {
			HttpSession session = request.getSession();
			session.removeAttribute("user");
			session.invalidate();//session失效
			Cookie[] cookies = request.getCookies();
			if(cookies==null||cookies.length==0){return true;}
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					cahcCacheService.removeKey("user:token:",cookie.getValue());
					break;
				}
			}
			return true;
	}
	

	@RequestMapping(value = "/login",method= RequestMethod.POST)
	@ResponseBody
	public ResponseData<UserEntity> login(HttpServletRequest request,String userName,String password,String ipAddress, int sik,Boolean isAuto) {
		try {
			if(StringUtil.isNull(userName)||StringUtil.isNull(password)||sik!=TimeUtil.getDay()){return ResponseData.newFailure("网络异常！稍后重试！");}
			if(isAuto==null||!isAuto){password = EncodeUtil.encodeByMD5(password);}else{password =StringUtil.MD5pwd(null, password);  }
			UserEntity user = this.userService.login(userName, password);
			if (user != null) {
				String cookie =StringUtil.getsysToken();
				user.setToken(cookie);
				user.setSystoke( StringUtil.MD5pwd(password, cookie));
				request.getSession().setAttribute("user",user);
				this.cahcCacheService.putData("user:token:",cookie, user);
				return ResponseData.newSuccess(user);
			}
			return ResponseData.newFailure("登录失败！");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("网络异常！请稍后重试！");
		}
	}
  
	
	/**
	 * 备注：将使用spring session 统一托管
	 * @param request
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/findUser", method = RequestMethod.GET)
	@ResponseBody
	public UserEntity findUser(HttpServletRequest request,String token) {
		UserEntity user =	(UserEntity) request.getSession().getAttribute("user");if(user!=null){  return user; }
		if(StringUtil.isnotNull(token)){user = cahcCacheService.getData("user:token:",token);if(user!=null){return user;}}
		if(StringUtil.isNull(token)){
			Cookie[] cookies = request.getCookies();if (cookies == null) {return null;}
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					token=cookie.getValue();
					return cahcCacheService.getData("user:token:",token);
				}
			}
		}
		return null;
	}
	


	
}
