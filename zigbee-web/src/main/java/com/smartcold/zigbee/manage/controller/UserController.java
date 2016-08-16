package com.smartcold.zigbee.manage.controller;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.dto.ResultDto;
import com.smartcold.zigbee.manage.entity.CookieEntity;
import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.CookieService;
import com.smartcold.zigbee.manage.service.DocLibraryService;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.util.EncodeUtil;
import com.smartcold.zigbee.manage.util.ResponseData;
import com.smartcold.zigbee.manage.util.SetUtil;
import com.smartcold.zigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.util.TelephoneVerifyUtil;
import com.taobao.api.ApiException;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;
	@Autowired
	private CookieService cookieService;
	@Resource(name="docLibraryService")
	private DocLibraryService docLibraryService;

	@RequestMapping(value = "/login")
	@ResponseBody
	public ResponseData<String> login(HttpServletRequest request, String userName, String password) {
		if(StringUtil.isnotNull(userName)&&StringUtil.isnotNull(password)){
			UserEntity user = userDao.findUser(userName, EncodeUtil.encodeByMD5(password));
			if (user != null) {
				String cookie = cookieService.insertCookie(userName);
				user.setPassword("********");
				request.getSession().setAttribute("user", user);
	            return  ResponseData.newSuccess(String.format("token=%s", cookie));
			}
			return ResponseData.newFailure("用户名或者密码不正确~");
		}else{
			return ResponseData.newFailure("用户名和密码不能为空~");
		}
		
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request) {
		request.getSession().removeAttribute("user");
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("token")) {
				cookieService.deleteCookie(cookie.getValue());
			}
		}
		return true;
	}

	@RequestMapping(value = "/findUser")
	@ResponseBody
	public Object findUser(HttpServletRequest request,String token) {
		UserEntity user = (UserEntity)request.getSession().getAttribute("user");
		if(user!=null){return user;}
		if(StringUtil.isNull(token)){
			Cookie[] cookies = request.getCookies();
			if(cookies!=null&&cookies.length>0){
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals("token")) {token=	cookie.getValue();break;}
				}
			}
		}
		if(StringUtil.isnotNull(token)){
			CookieEntity effectiveCookie = cookieService.findEffectiveCookie(token);
			if (effectiveCookie != null) {
				user = userDao.findUserByName(effectiveCookie.getUsername());
				if(user!=null){
					user.setPassword("********");
					request.getSession().setAttribute("user", user);
					return user;
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
	
	@RequestMapping(value = "/checkVerifyCode")
	@ResponseBody
	public Object checkVerifyCode(HttpServletRequest request, String verifycode) {
		if (verifycode!=null&&request.getSession().getAttribute("identityVerifyCode")!=null) {
			if(request.getSession().getAttribute("identityVerifyCode").equals(verifycode))
				return true;
		}
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
	
	@RequestMapping(value = "/identityVerify", method = RequestMethod.POST)
	@ResponseBody
	public Object identityVerify(HttpServletRequest request, String telephone) throws ApiException {
		if(telephone!=null&&!telephone.equals("")){
			TelephoneVerifyUtil teleVerify = new TelephoneVerifyUtil();
			String identityVerifyCode = teleVerify.identityVerify(telephone);
			request.getSession().setAttribute("identityVerifyCode", identityVerifyCode);
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
		if(signUpCode==null||!(request.getSession().getAttribute("signUpCode")+"").equalsIgnoreCase(signUpCode))
			return new ResultDto(-1, "验证码输入错误");
		UserEntity userEntity = new UserEntity();
		userEntity.setUsername(username);
		userEntity.setPassword(EncodeUtil.encodeByMD5(password));
		userEntity.setEmail(email);
		userEntity.setTelephone(telephone);
		userDao.insertUser(userEntity);
		return new ResultDto(0, "注册成功");
	}
	
	
	@RequestMapping(value = "/updateUser")
	@ResponseBody
	public Object updateUser(HttpServletRequest request,UserEntity user) throws ApiException {
		try {
			UserEntity old_user = (UserEntity)request.getSession().getAttribute("user");
		//	user.setId(old_user.getId());
			List<FileDataEntity> handleFile = this.docLibraryService.handleFile(old_user.getId(), FileDataMapper.CATEGORY_AVATAR_PIC, old_user, request);//用于更新头像信息
			if(SetUtil.isnotNullList(handleFile)){
				FileDataEntity fileDataEntity = handleFile.get(0);
				user.setAvatar(FtpService.READ_URL+fileDataEntity.getLocation());
			}else{
				user.setAvatar(null);
			}
			if(user.getId()!=0){
				if(StringUtil.isnotNull(user.getPassword())){user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));}
				this.userDao.updateUser(user);
				UserEntity	ol_user=this.userDao.findUserById(user.getId());
				ol_user.setPassword("********");
				request.getSession().setAttribute("user",ol_user);
				return true;
			}
			return false;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}
	
	@RequestMapping(value = "/checkOldPassword")
	@ResponseBody
	public boolean checkOldPassword(HttpServletRequest request,String pwd){
		if(StringUtil.isNull(pwd)){return false;};
		pwd=EncodeUtil.encodeByMD5(pwd);
		UserEntity ol_user = (UserEntity)request.getSession().getAttribute("user");
		UserEntity	new_user=this.userDao.findUserById(ol_user.getId());
		return pwd.equals(new_user.getPassword());
	}
	@RequestMapping(value = "/upPwdByTelephone")
	@ResponseBody
	public ResponseData<String> upPwdByTelephone(HttpServletRequest request,String key,String toke,UserEntity user){
		if(StringUtil.isnotNull(key)&&StringUtil.isnotNull(toke)){
			String stoke=request.getSession().getAttribute(key+"shear_yzm")+""; request.getSession().removeAttribute(key+"shear_yzm");  
			if(toke.equalsIgnoreCase(stoke)){
				if(StringUtil.isnotNull(user.getPassword())){user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));}
				boolean isok=this.userDao.upPwdByTelephone(user)>0;
				if(isok){
					return ResponseData.newSuccess("密码修改重置成功！");
					
				}else{
					return ResponseData.newFailure("密码重置失败！该账户已被锁定！请联系管理员！");
				}
			}else{
				return ResponseData.newFailure("非法操作！");			}
		}
		return ResponseData.newFailure("非法操作！");		//返回受影响的行
	}
	@RequestMapping(value = "/existenceUserName")
	@ResponseBody
	public boolean existenceUserName(HttpServletRequest request,String userName){
		return this.userDao.existenceUserName(userName)>0;
	}

}
