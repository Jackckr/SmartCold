package com.smartcold.manage.cold.controller;

import java.util.Calendar;
import java.util.Date;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
					cahcCacheService.removeKey("user:token:"+cookie.getValue());
					break;
				}
			}
			return true;
	}
	
//	@RequestMapping(value = "/login")
//	@ResponseBody
//	public Object login(HttpServletRequest request, HttpServletResponse response, String userName, String password) {
//		if(StringUtil.isNull(userName)||StringUtil.isNull(password)){return new ResultDto(1, "请输入完整信息！");}
//		UserEntity user = userService.getUserByNAndP(userName, EncodeUtil.encodeByMD5(password));
//		if (user.getId() != 0) {
//			String cookie = EncodeUtil.encode("sha1", String.format("%s%s", userName, new Date().getTime()));
//			RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
//			user.setRole(roleUser==null?0:roleUser.getRoleid());
//			cahcCacheService.putData("user:token:"+cookie, user);
//			if(roleUser==null){//判断有没有申请
//				if(user.getType()==0){
//					return new ResultDto(this.rdcauthMapping.getRdcAuthByUid(user.getId())==0?2:3, String.format("token=%s", cookie));//未授权
//				}else{
//					return new ResultDto(this.messageRecordMapping.getUserAuth(user.getId())==0?2:3, String.format("token=%s", cookie));//未授权
//				}
//			}
//			return new ResultDto(0, String.format("token=%s", cookie));
//		}
//		return new ResultDto(1, "用户名或密码错误！");
//		return null;
//	}
	
	/**
	 * 
	 * @param request
	 * @param userName:用户名
	 * @param password:密码
	 * @param sik:过滤标识
	 * @param isAuto：是否为自动登录
	 * @return
	 */
	@RequestMapping(value = "/login",method= RequestMethod.POST)
	@ResponseBody
	public ResponseData<Object> login(HttpServletRequest request,String userName,String password, int sik,Boolean isAuto) {
		try {
			if(StringUtil.isNull(userName)||StringUtil.isNull(password)||sik!=Calendar.getInstance().get(Calendar.HOUR_OF_DAY)){ 
				return ResponseData.newFailure("网络异常！稍后重试！");
			}
			if(isAuto==null||!isAuto){password = EncodeUtil.encodeByMD5(password);}else{password =StringUtil.MD5pwd(null, password);  }
			UserEntity user = this.userService.login(userName, password);
			if (user != null) {
				String cookie =StringUtil.getsysToken();
				user.setToken(cookie);
				user.setSystoke( StringUtil.MD5pwd(password, cookie));
				request.getSession().setAttribute("user",user);
				this.cahcCacheService.putData("user:token:"+cookie, user);
				return ResponseData.newSuccess( String.format("token=%s", cookie));
			}

			return ResponseData.newFailure("登录失败！");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("网络异常！请稍后重试！");
		}
	}

	


	
}
