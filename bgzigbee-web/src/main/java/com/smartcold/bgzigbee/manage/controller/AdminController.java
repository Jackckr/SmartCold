package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dao.AdminMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.NgRemoteValidateDTO;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.AdminEntity;
import com.smartcold.bgzigbee.manage.entity.CookieEntity;
import com.smartcold.bgzigbee.manage.service.CookieService;
import com.smartcold.bgzigbee.manage.util.EncodeUtil;
import com.smartcold.bgzigbee.manage.util.ResponseData;
/**
 * 
 *@author Kaiqiang Jiang
 *@date:2016-6-22 上午11:48:35
 *@Description: Admin login and logout & find admin & add admin
 */
@Controller
@RequestMapping(value = "/admin")
public class AdminController extends BaseController {

	@Autowired
	private AdminMapper adminDao;

	@Autowired
	private CookieService cookieService;

	private static Map<String,Integer> Blacklist=new HashMap<String, Integer>();
	
//	@Scheduled(cron = "0 30 1 * * ?")
//	public void checkAPStatus() {
//		Blacklist.clear();//清除黑名单
//	}
	
	
	@RequestMapping(value = "/login",method= RequestMethod.POST)
	@ResponseBody
	public Object login(HttpServletRequest request, @RequestParam(value="adminName",required=true) String adminName,@RequestParam(value="adminPwd",required=true) String adminPwd,@RequestParam(value="sik",required=true)  Integer sik) {
		try {
			if(sik!=Calendar.getInstance().get(Calendar.HOUR_OF_DAY)){ return ResponseData.newFailure("登录过于频繁，请24小时后再试!");}
//			String remoteAddr = request.getRemoteAddr();
//			if(Blacklist.containsKey(remoteAddr)){
//				Integer count = Blacklist.get(remoteAddr);count++;Blacklist.put(remoteAddr,count);if(count>3){ return ResponseData.newFailure("登录过于频繁，请24小时后再试");}
//			}else{
//				Blacklist.put(remoteAddr,1);
//			}
			adminPwd = EncodeUtil.encodeByMD5(adminPwd);
			AdminEntity admin = adminDao.findAdmin(adminName, adminPwd);
			if (admin != null&&admin.getRole()>=0) {
				String cookie = cookieService.insertCookie(adminName);
			    admin.setAdminpwd(null);
				request.getSession().setAttribute("admin", admin);
//				Blacklist.remove(remoteAddr);
				return	ResponseData.newSuccess(String.format("token=%s", cookie));
			}
			return ResponseData.newFailure("用户名或者密码不正确！");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("数据连接异常！请稍后重试！");
		}
	}
	
	@RequestMapping(value = "/userlogin",method= RequestMethod.POST)
	@ResponseBody
	public Object userlogin(HttpServletRequest request,@RequestParam(value="adminName",required=true) String adminName,@RequestParam(value="adminPwd",required=true) String adminPwd,@RequestParam(value="sik",required=true)  Integer sik) {
		try {
			if(sik==null||sik!=Calendar.getInstance().get(Calendar.HOUR_OF_DAY)){ return ResponseData.newFailure("登录过于频繁，请24小时后再试!");}
//			String remoteAddr = request.getRemoteAddr();
//			if(Blacklist.containsKey(remoteAddr)){
//				Integer count = Blacklist.get(remoteAddr);count++;Blacklist.put(remoteAddr,count);if(count>3){ return ResponseData.newFailure("登录过于频繁，请24小时后再试");}
//			}else{
//				Blacklist.put(remoteAddr,1);
//			}
			adminPwd = EncodeUtil.encodeByMD5(adminPwd);
			AdminEntity admin = adminDao.findAdmin(adminName, adminPwd);
			if (admin != null) {
				String cookie = cookieService.insertCookie(adminName);
			    admin.setAdminpwd(null);
				request.getSession().setAttribute("admin", admin);
//				Blacklist.remove(remoteAddr);
				HashMap<String, Object> resdata=new HashMap<String, Object>();
				resdata.put("user", admin);
				resdata.put("token", String.format("token=%s", cookie));
				return	ResponseData.newSuccess(resdata);
			}
			return ResponseData.newFailure("用户名或者密码不正确！");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("数据连接异常！请稍后重试！");
		}
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	@ResponseBody
	public Object logout(HttpServletRequest request) {
		request.getSession().removeAttribute("admin");
		Cookie[] cookies = request.getCookies();
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("token")) {
				cookieService.deleteCookie(cookie.getValue());
			}
		}
		return true;
	}


	@RequestMapping(value = "/findAdminList", method = RequestMethod.POST)
	@ResponseBody
	public Object findAdminList(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize,
			@RequestParam(value="keyword", required=false) String keyword) {
		    pageNum = pageNum == null? 1:pageNum;
		    pageSize = pageSize==null? 12:pageSize;
		    PageHelper.startPage(pageNum, pageSize);
		    return new PageInfo<AdminEntity>(adminDao.findAllAdmin(keyword));
	}
	
	@RequestMapping(value = "/deleteAdmin", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteAdmin(int adminID) {
		 adminDao.deleteAdmin(adminID);
		 return new BaseDto(0);
	}
	
	@RequestMapping(value = "/deleteByAdminIDs", method=RequestMethod.DELETE)
	@ResponseBody
	public Object deleteByAdminIDs(Integer[] adminIDs) {
		for(Integer adminID:adminIDs){
			adminDao.deleteAdmin(adminID);
		}
		return new BaseDto(0);
	}
	
	@RequestMapping(value = "/findAdmin")
	@ResponseBody
	public Object findAdmin(HttpServletRequest request) {
		AdminEntity admin = (AdminEntity)request.getSession().getAttribute("admin");
		if(admin!=null&&admin.getId()!=0){return ResponseData.newSuccess(admin);}
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("token")) {
					CookieEntity effectiveCookie = cookieService
							.findEffectiveCookie(cookie.getValue());
					if (effectiveCookie != null) {
						admin = adminDao.findAdminByName(effectiveCookie.getUsername());
						if(admin==null)return ResponseData.newSuccess(new AdminEntity());
						admin.setAdminpwd(null);
						request.getSession().setAttribute("admin", admin);
						return ResponseData.newSuccess(admin);
					}
				}
			}
		}
		admin=new AdminEntity();
		return ResponseData.newSuccess(admin);
	}

	@RequestMapping(value = "/addAdmin", method = RequestMethod.GET)
	@ResponseBody
	public Object addAdmin(AdminEntity admin) throws UnsupportedEncodingException {
		if (admin.getAdminname() == null || admin.getAdminpwd() == null) {
			return new ResultDto(-1, "用户名和密码不能为空");
		}
		admin.setAdminname(URLDecoder.decode(admin.getAdminname(), "UTF-8"));
		admin.setAdminpwd(EncodeUtil.encodeByMD5(admin.getAdminpwd()));
		adminDao.insertAdmin(admin);
		return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value = "/checkAdminName", method = RequestMethod.GET)
	public Object checkAdminName(@RequestParam("value") String adminname) {
		adminname = StringUtils.trimAllWhitespace(adminname);
		NgRemoteValidateDTO ngRemoteValidateDTO = new NgRemoteValidateDTO();
		ngRemoteValidateDTO.setValid(adminDao.findAdminByName(adminname)==null? true:false);
		return ngRemoteValidateDTO;
	}
	
}
