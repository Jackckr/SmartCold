package com.smartcold.zigbee.manage.controller;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.smartcold.zigbee.manage.dao.FileDataMapper;
import com.smartcold.zigbee.manage.dao.RdcauthMapping;
import com.smartcold.zigbee.manage.dao.RoleUserMapper;
import com.smartcold.zigbee.manage.dao.UserMapper;
import com.smartcold.zigbee.manage.dto.ResultDto;
import com.smartcold.zigbee.manage.dto.ResultDtoStr;
import com.smartcold.zigbee.manage.dto.UploadFileEntity;
import com.smartcold.zigbee.manage.entity.CookieEntity;
import com.smartcold.zigbee.manage.entity.FileDataEntity;
import com.smartcold.zigbee.manage.entity.RdcAuthEntity;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.CookieService;
import com.smartcold.zigbee.manage.service.DocLibraryService;
import com.smartcold.zigbee.manage.service.FtpService;
import com.smartcold.zigbee.manage.util.EncodeUtil;
import com.smartcold.zigbee.manage.util.ResponseData;
import com.smartcold.zigbee.manage.util.SetUtil;
import com.smartcold.zigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.util.TelephoneVerifyUtil;
import com.smartcold.zigbee.manage.util.TimeUtil;
import com.taobao.api.ApiException;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

	@Autowired
	private UserMapper userDao;
	@Autowired
	private CookieService cookieService;
	@Autowired
	private FtpService ftpService;
	@Autowired
	private FileDataMapper fileDataDao;
	@Autowired
	private RoleUserMapper roleUserMapper;
	@Autowired
	private RdcauthMapping rdcauthMapping;
	@Resource(name="docLibraryService")
	private DocLibraryService docLibraryService;

	@RequestMapping(value = "/login")
	@ResponseBody
	public ResponseData<String> login(HttpServletRequest request, String userName, String password) {
		if(StringUtil.isnotNull(userName)&&StringUtil.isnotNull(password)){
			this.logout(request);
			UserEntity user = userDao.findUser(userName, EncodeUtil.encodeByMD5(password));
			if (user != null) {
				String cookie = cookieService.insertCookie(userName);
				user.setPassword(null);
				request.getSession().setAttribute("user", user);
	            return  ResponseData.newSuccess(String.format("token=%s", cookie));
			}
			return ResponseData.newFailure("用户名或者密码不正确~");
		}else{
			return ResponseData.newFailure("用户名和密码不能为空~");
		}
	}

	@RequestMapping(value = "/attestationUser")
	@ResponseBody
	public ResultDto attestationUser(UserEntity u,MultipartFile authfile){
		UserEntity userEntity = userDao.findUserById(u.getId());
		String fileDataType=u.getType()==1?FileDataMapper.CATEGORY_USERAUTH_PIC:FileDataMapper.CATEGORY_UPAUTH_PIC;
		int authType=u.getType()==1?3:4;
		String authMsg=u.getType()==1?"\"普通级vip用户\"(姓名："+u.getRealname()+"身份证："+u.getIdCard()+")":"\"企业级vip用户\"(企业名："+u.getCompanyName()+")";
		String dir =null;String fileName=null;String msg="";
		if (authfile != null) {//
			dir = String.format("%s/user/%s", "picture", u.getId());
			fileName = String.format("user%s_%s.%s",u.getId(), new Date().getTime(), "jpg");
			UploadFileEntity uploadFileEntity = new UploadFileEntity(fileName, authfile, dir);
			this.ftpService.uploadFile(uploadFileEntity);
			FileDataEntity arrangeFile = new FileDataEntity(authfile.getContentType(), dir + "/" + fileName,fileDataType, u.getId(), fileName);
			this.fileDataDao.saveFileData(arrangeFile);
		}
		RdcAuthEntity auchedata = new RdcAuthEntity();
		auchedata.setType(authType);
		auchedata.setUid(u.getId());
		auchedata.setMsg(userEntity.getUsername()+"请求认证"+authMsg+"，请及时处理！");
		if(authfile!=null){
			auchedata.setImgurl(dir + File.separator + fileName);
		}
		this.rdcauthMapping.insertCertification(auchedata);//插入认证信息
		if(StringUtil.isnotNull(u.getIdCard())){userEntity.setIdCard(u.getIdCard());}
		if(StringUtil.isnotNull(u.getRealname())){userEntity.setRealname(u.getRealname());}
		if(StringUtil.isnotNull(u.getCompanyName())){userEntity.setCompanyName(u.getCompanyName());}
		userDao.updateUser(userEntity);
		msg="尊敬的用户，您的申请已提交成功，受理编号为<span id=\"proNo\">"+auchedata.getId()+"</span>。";
		return new ResultDto(1,msg);
	}


	@RequestMapping(value = "/isSubmitAuditUser")
	@ResponseBody
	public ResultDto isSubmitAuditUser(Integer userId){
		List<RdcAuthEntity> rdcAuthEntities = rdcauthMapping.selByAuditUid(userId);
		UserEntity user= userDao.findUserById(userId);
		String msg="";
		int result=0;
		if(rdcAuthEntities!=null&&rdcAuthEntities.size()!=0){
			result=2;
			if(rdcAuthEntities.get(0).getState()==-1){
				result=-1;
				msg=rdcAuthEntities.get(0).getNote();
			}else if (rdcAuthEntities.get(0).getState()==1){
				result=1;
			}
		}
		if (user.getVipType()>0){
				result=1;
		}
		List<HashMap<String, Object>> hashMaps = roleUserMapper.selByUserId(userId);
		if(hashMaps !=null && hashMaps.size()!=0){
			result=1;
			UserEntity userEntity = new UserEntity();
			userEntity.setId(userId);
			userEntity.setVipType(2);
			userEntity.setAvatar(null);
			userDao.updateUser(userEntity);
		}
		return new ResultDto(result,msg);
	}


	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request) {
		request.getSession().removeAttribute("user");
		Cookie[] cookies = request.getCookies();
		if(cookies!=null&&cookies.length>0){
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					cookieService.deleteCookie(cookie.getValue());
				}
			}
		}
		return true;
	}

	@RequestMapping(value = "/findUser")
	@ResponseBody
	public Object findUser(HttpServletRequest request,String token,Boolean isupdate) {
		UserEntity user =new UserEntity();
		/*if(isupdate==null||!isupdate){
			 user = (UserEntity)request.getSession().getAttribute("user");
			if(user!=null){
			   return user;
			}else{
				user =new UserEntity();
			}
		}*/
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
					user.setPassword(null);
					request.getSession().setAttribute("user", user);
					return user;
				}
			}
		}
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
	
	@Deprecated
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
	//=======================================================================找回密码=====================================================================================
	 /* 
	 * @return
	 */
	@RequestMapping(value="telephoneSIDVerify")
	@ResponseBody
	public ResponseData<String> telephoneSIDVerify(HttpServletRequest request,String telephone){
		try {
			if(StringUtil.isnotNull(telephone)){
				TelephoneVerifyUtil teleVerify = new TelephoneVerifyUtil();
				String signUpCode =teleVerify.identityVerify(telephone);
				ResponseData<String> instance = ResponseData.getInstance();
				instance.setSuccess(true);
				instance.setEntity(EncodeUtil.encodeByMD5(signUpCode+TimeUtil.getDay()));
				instance.setExtra(signUpCode+TimeUtil.getLongtime());
				instance.setMessage("验证码已发送到您的手机~请注意查收~");
				return instance;
			}
			return  ResponseData.newFailure("请输入有效的手机号码~");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseData.newFailure("未知异常~");
	}
	
	@RequestMapping(value = "/resetPwdByUserName")
	@ResponseBody
	public ResponseData<String> resetPwdByUserName(HttpServletRequest request,String toke,String stoken, UserEntity user){
		if(StringUtil.isnotNull(toke)&&StringUtil.isnotNull(stoken)&&stoken.equals(EncodeUtil.encodeByMD5(toke+TimeUtil.getDay()))){
			user.setPassword(EncodeUtil.encodeByMD5(user.getPassword()));
				boolean isok=this.userDao.upPwdByUserNameAndtelephone(user)>0;
				if(isok){
					return ResponseData.newSuccess("密码修改重置成功！");
				}else{
					return ResponseData.newFailure("用户名和手机号不匹配！");
				}
			}else{
				return ResponseData.newFailure("非法操作！");			
			}
	}
	
	//============================================================================================================================================================
	
	@RequestMapping(value = "/getVerCode", method = RequestMethod.POST)
	@ResponseBody
	public Object getVerCode(HttpServletRequest request,Integer key,String reg, String telephone) throws ApiException {
		int day=Calendar.getInstance().get(Calendar.DATE);//获取日  
		if( key==day*2&&("/register.html".equals(reg)||"/registerStep.html".equals(reg))&&StringUtil.isnotNull(telephone)){
			TelephoneVerifyUtil teleVerify = new TelephoneVerifyUtil();
			String signUpCode = teleVerify.signUpVerify(telephone);//md5加密
			return signUpCode;
		}
		return null;
	}
	
	@RequestMapping(value = "/identityVerify", method = RequestMethod.POST)
	@ResponseBody
	public Object identityVerify(HttpServletRequest request,String sid, String vercode,String telephone) throws ApiException {
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
	public Object signup(HttpServletRequest request,String username, String password,String password1, String email,String telephone,String signUpCode,Integer type) throws ApiException {
		if (username == null || password == null || !password.equals(password1)) {
			return new ResultDtoStr("-1", "用户名密码输入错误");
		}
		String sessyzm=""+request.getSession().getAttribute("signUpCode");
		if(StringUtil.isNull(sessyzm)||"null".endsWith(sessyzm)){
			sessyzm=request.getSession().getAttribute("signUpCodeshear_yzm")+"";
			}//跨app获得验证码
		if(signUpCode==null||!(sessyzm).equalsIgnoreCase(signUpCode))
			return new ResultDtoStr("-1", "验证码输入错误");
		if(type==null){type=0;}
		UserEntity userEntity = new UserEntity();   
		userEntity.setType(type);
		userEntity.setUsername(username);
		userEntity.setPassword(EncodeUtil.encodeByMD5(password));
		userEntity.setEmail(email);
		userEntity.setTelephone(telephone);
		userDao.insertUser(userEntity);
		return new ResultDtoStr("0", "注册成功");
	}
	
	
	@RequestMapping(value = "/updateUser")
	@ResponseBody
	public Object updateUser(HttpServletRequest request,UserEntity user) throws ApiException {
		try {
			if(user.getId()==0){
				UserEntity old_user = (UserEntity)request.getSession().getAttribute("user");
				if(old_user!=null){
					user.setId(old_user.getId());
				}else{
					return false;
				}
			}
			List<FileDataEntity> handleFile = this.docLibraryService.handleFile(user.getId(), FileDataMapper.CATEGORY_AVATAR_PIC, user, request);//用于更新头像信息
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
				ol_user.setPassword(null);
				request.getSession().setAttribute("user",ol_user);
				return ol_user;
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
	
	@Deprecated
	@RequestMapping(value = "/upPwdByTelephone")
	@ResponseBody
	public ResponseData<String> upPwdByTelephone(HttpServletRequest request,String key,String toke,String stoken, UserEntity user){
		if(StringUtil.isnotNull(key)&&StringUtil.isnotNull(toke)){
			String stoke=request.getSession().getAttribute(key+"shear_yzm")+""; request.getSession().removeAttribute(key+"shear_yzm"); 
			if(toke.equalsIgnoreCase(stoke)||StringUtil.getToken().equals(stoken)||stoken.equals(EncodeUtil.encodeByMD5(toke+TimeUtil.getDateHour()))){
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
	
	/**
	 * 检查用户名是否占用
	 * @param request true：表示当前用户名已存在或为null->不能注册
	 * @param userName
	 * @return
	 */
	@RequestMapping(value = "/addmessaged ")
	@ResponseBody
	public ResponseData<String>  addmessaged (HttpServletRequest request,String userName,String telephone,String corporateName,String note){
		if(StringUtil.isNull(userName)||StringUtil.isNull(telephone)){return ResponseData.newFailure("请填写完整信息！");}
		this.userDao.addmsg(userName, telephone, corporateName, note);
		return ResponseData.newSuccess();
	}

}
