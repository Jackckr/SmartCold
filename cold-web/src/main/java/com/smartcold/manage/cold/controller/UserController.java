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

import com.smartcold.manage.cold.dao.olddb.MessageRecordMapping;
import com.smartcold.manage.cold.dao.olddb.RdcauthMapping;
import com.smartcold.manage.cold.dao.olddb.UserMapper;
import com.smartcold.manage.cold.dto.ResultDto;
import com.smartcold.manage.cold.entity.olddb.RoleUser;
import com.smartcold.manage.cold.entity.olddb.UserEntity;
import com.smartcold.manage.cold.service.RoleService;
import com.smartcold.manage.cold.service.RoleUserService;
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
					cahcCacheService.cleraChace(cookie.getValue());
					break;
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
			String cookie = EncodeUtil.encode("sha1", String.format("%s%s", userName, new Date().getTime()));
			RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
			user.setRole(roleUser==null?0:roleUser.getRoleid());
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
	@RequestMapping(value = "/userlogin",method= RequestMethod.POST)
	@ResponseBody
	public Object userlogin(HttpServletRequest request,String userName,String password, int sik,Boolean isAuto) {
		try {
			if(StringUtil.isNull(userName)||StringUtil.isNull(password)||sik!=Calendar.getInstance().get(Calendar.HOUR_OF_DAY)){ return new ResultDto(1, "请输入完整信息！");}
			if(isAuto==null||!isAuto){password = EncodeUtil.encodeByMD5(password);}else{password =StringUtil.MD5pwd(null, password);  }
			UserEntity user = userDao.Login(userName, password);
			if (user != null) {
				if (user.getLevel()==-1) {return new ResultDto(1, "用户名或密码错误！");	}
				RoleUser roleUser = roleUserService.getRoleIdByUserId(user.getId());
				user.setRole(roleUser==null?0:roleUser.getRoleid());
				String cookie =  EncodeUtil.encode("sha1", String.format("%s%s", userName, new Date().getTime()));
				user.setToken(cookie);
				user.setSystoke( StringUtil.MD5pwd(password, cookie));
				request.getSession().setAttribute("user",user);
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
		} catch (Exception e) {
			e.printStackTrace();
			return new ResultDto(1, "网络异常！请稍后重试！");
		}
	}

	


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

	/**
	 * 备注：将使用spring session 统一托管
	 * @param request
	 * @param token
	 * @return
	 */
	@RequestMapping(value = "/findUser", method = RequestMethod.GET)
	@ResponseBody
	public UserEntity findUser(HttpServletRequest request,String token) {
		UserEntity user =	(UserEntity) request.getSession().getAttribute("user");
		if(user!=null){  return user; }
		if(StringUtil.isnotNull(token)){
			 user = cahcCacheService.getDataFromCache(token);
			if(user!=null){return user;}
		}
		if(StringUtil.isNull(token)){
			Cookie[] cookies = request.getCookies();
			if (cookies == null) {
				return new UserEntity();
			}
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					token=cookie.getValue();
					 user = cahcCacheService.getDataFromCache(token);
					if(user!=null){return user;}else{return new UserEntity();}
				}
			}
		}
		return new UserEntity();
	}
	
	
	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	@ResponseBody
	public Object signup(HttpServletRequest request,String username, String password,String telephone,String signUpCode) {
		if (StringUtil.isNull(username)||StringUtil.isNull(password)||StringUtil.isNull(telephone)||StringUtil.isNull(signUpCode)) {return  ResponseData.newFailure("请输入必填信息！");}
		try {
			UserEntity user = new UserEntity();
			user.setUsername(username);
			user.setPassword(EncodeUtil.encodeByMD5(password));
			user.setTelephone(telephone);
			this.userDao.insertUser(user);
			String cookie = EncodeUtil.encode("sha1", String.format("%s%s", username, new Date().getTime()));
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
		if(StringUtil.isNull(pwd)||StringUtil.isNull(token)){return false;};
		pwd=EncodeUtil.encodeByMD5(pwd);
		UserEntity user = cahcCacheService.getDataFromCache(token);
		if(user!=null){
			user = userDao.findById(user.getId());
		}else{
			return false;
		}
		return pwd.equals(user.getPassword());
	}
	
	/**
	 * 
	 * @param request
	 * @param token
	 * @param rdcId
	 * @param isgetConf
	 */
	@RequestMapping(value = "/getWiseconfByRdc")
	@ResponseBody
	public Object getWiseconfByRdc(HttpServletRequest request,String token ,int rdcId ,boolean isgetConf){
	     UserEntity user = this.findUser(request, token);
		 if(user.getId()==0){return ResponseData.newFailure(); }
		 
		 
		 
	     
		return null;
	
	}
	
}
