package com.smartcold.manage.cold.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
import com.smartcold.manage.cold.dao.olddb.RdcauthMapping;
import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.entity.olddb.CookieEntity;
import com.smartcold.manage.cold.entity.olddb.Role;
import com.smartcold.manage.cold.entity.olddb.RoleUser;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.CacheService;
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
	private RdcauthMapping rdcauthMapping;
	@Autowired
	private MessageRecordMapping messageRecordMapping;

	@Autowired
	private UserMapper userDao;

	@Autowired
	private CookieService cookieService;
	@Autowired
	private CacheService cahcCacheService;
	
	
	

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request) {
		request.getSession().setAttribute("user", null);
		Cookie[] cookies = request.getCookies();
		if(cookies==null||cookies.length==0){return true;}
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("token")) {
				cahcCacheService.cleraChace(request.getSession().getId());
				cookieService.deleteCookie(cookie.getValue());
			}
		}
		return true;
	}
	
	@RequestMapping(value = "/login")
	@ResponseBody
	public Object login(HttpServletRequest request, HttpServletResponse response, String userName, String password) {
		if(StringUtil.isNull(userName)||StringUtil.isNull(password)){return new ResultDto(1, "请输入完整信息！");}
		UserEntity user = userService.getUserByNAndP(userName, EncodeUtil.encodeByMD5(password));
		if (user.getId() != 0) {
			String cookie = cookieService.insertCookie(userName);
			RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
			user.setPassword(null);
			user.setRole(roleUser==null?0:roleUser.getRoleid());
			request.getSession().setAttribute("user", user);
			response.addCookie(new Cookie("token", cookie));
			cahcCacheService.putDataTocache(request.getSession().getId(), user);
			cahcCacheService.putDataTocache(cookie, user);
			if(roleUser==null){//判断有没有申请
				if(user.getType()==0){
					return new ResultDto(this.rdcauthMapping.getRdcAuthByUid(user.getId())==0?2:3, String.format("token=%s", cookie));//未授权
				}else{
					return new ResultDto(this.messageRecordMapping.getUserAuth(user.getId())==0?2:3, String.format("token=%s", cookie));//未授权
				}
			}
			return new ResultDto(0, String.format("token=%s", cookie));
		}
		return new ResultDto(1, "用户名或密码错误！");
	}
	
	/**
	 * 
	 * @param request
	 * @param userName:用户名
	 * @param password:密码
	 * @param sik:过滤标识
	 * @param isAuto：是否为自动登录
	 * @return
	 */
	/*
	@RequestMapping(value = "/userlogin",method= RequestMethod.POST)
	@ResponseBody
	public Object userlogin(HttpServletRequest request,String userName,String password, int sik,Boolean isAuto) {
		try {
			if(StringUtil.isNull(userName)||StringUtil.isNull(password)||sik!=Calendar.getInstance().get(Calendar.HOUR_OF_DAY)){ return new ResultDto(1, "请输入完整信息！");}
			this.logout(request);
			if(isAuto==null||!isAuto){password = EncodeUtil.encodeByMD5(password);}else{password =StringUtil.MD5pwd(null, password);  }
			UserEntity user = userService.getUserByNAndP(userName, password);
			if (user != null) {
				String cookie = cookieService.insertCookie(userName);
				user.setToken(cookie);
				user.setPassword(null);
				HashMap<String, Object> resdata=new HashMap<String, Object>();
				resdata.put("user", user);
				resdata.put("sid", request.getSession().getId());
				resdata.put("toke",cookie);
				resdata.put("systoke", StringUtil.MD5pwd(password, cookie));
				return	ResponseData.newSuccess(resdata);
			}
			return ResponseData.newFailure("用户名或者密码不正确！");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("数据连接异常！请稍后重试！");
		}
	}

	
	@RequestMapping(value = "/isLogin", method = RequestMethod.GET)
	@ResponseBody
	public Object isLogin(HttpSession session) {
		String id = session.getId();
		
		
		return new UserEntity();
	}
	*/
	/**
	 * 身份校验
	 * @param request
	 * @param userId
	 * @param type
	 * @return
	 */
	@RequestMapping(value = "/getUserAuthen")
	@ResponseBody
	public Object getUserAuthen(int userId,int type) {
			try {
				RoleUser roleUser = roleUserService.getRoleIdByUserId(userId);
				if(roleUser==null){//判断有没有申请
					if(type==0){
						return new ResultDto(this.rdcauthMapping.getRdcAuthByUid(userId)==0?2:3, "");//未授权
					}else{
						return new ResultDto(this.messageRecordMapping.getUserAuth(userId)==0?2:3, "");//未授权
					}
				}
				return new ResultDto(0,"身份验证成功");
			} catch (Exception e) {
				e.printStackTrace();
			}
			return new ResultDto(1,"身份验证失败！");
	}

	@RequestMapping(value = "/updateUser")
	@ResponseBody
	public boolean updateUser(int id,String password){
		UserEntity userEntity = new UserEntity();
		userEntity.setId(id);
		userEntity.setPassword(EncodeUtil.encodeByMD5(password));
		userEntity.setAvatar(null);
		int i = userDao.updateByPrimaryKeySelective(userEntity);
		return i>0;
	}


	@RequestMapping(value = "/findUser", method = RequestMethod.GET)
	@ResponseBody
	public Object findUser(HttpServletRequest request,String token) {
		System.err.println("服务器B："+request.getSession().getId());
		if(StringUtil.isnotNull(token)){
			UserEntity user = cahcCacheService.getDataFromCache(token);
			if(user!=null){
				return user;
			}
		}
		UserEntity user = cahcCacheService.getDataFromCache(request.getSession().getId());
		if(user!=null){
			return user;
		}
	    user =new UserEntity();// (UserEntity)request.getSession().getAttribute("user");//		if(user!=null){return user;}
		if(StringUtil.isNull(token)){
			Cookie[] cookies = request.getCookies();
			if (cookies == null) {
				return new UserEntity();
			}
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					token=cookie.getValue();
					break;
				}
			}
		}
		if(StringUtil.isNull(token)){return user;}
		CookieEntity effectiveCookie = cookieService.findEffectiveCookie(token);
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
		return new UserEntity();
	}
	
	
	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	@ResponseBody
	public Object signup(HttpServletRequest request,String username, String password,String telephone,String signUpCode) {
		if (StringUtil.isNull(username)||StringUtil.isNull(password)||StringUtil.isNull(telephone)||StringUtil.isNull(signUpCode)) {return  ResponseData.newFailure("请输入必填信息！");}
		try {
			this.logout(request);//q
			UserEntity user = new UserEntity();
			user.setUsername(username);
			user.setPassword(EncodeUtil.encodeByMD5(password));
			user.setTelephone(telephone);
			this.userDao.insertUser(user);
			String cookie = this.cookieService.insertCookie(username);
			return  ResponseData.newSuccess(String.format("token=%s", cookie));
		} catch (Exception e) {
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

	@RequestMapping(value = "/checkTelephone")
	@ResponseBody
	public Boolean checkTelephone(String telephone){
		return this.userDao.findUserByTelephone(telephone)==null?true:false;
	}

	@RequestMapping(value = "/checkOldPassword")
	@ResponseBody
	public boolean checkOldPassword(HttpServletRequest request,String pwd,String token){
		if(StringUtil.isNull(pwd)){return false;};
		pwd=EncodeUtil.encodeByMD5(pwd);
		UserEntity new_user=null;
		CookieEntity effectiveCookie = cookieService.findEffectiveCookie(token);
		if (effectiveCookie != null) {
			new_user = userDao.findUserByName(effectiveCookie.getUsername());
			if (new_user==null){return false;}
		}else {
			return false;
		}
		return pwd.equals(new_user.getPassword());
	}
}
