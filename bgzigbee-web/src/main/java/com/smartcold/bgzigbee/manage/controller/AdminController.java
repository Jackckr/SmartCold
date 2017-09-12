package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.smartcold.bgzigbee.manage.entity.ACLAdminNode;
import com.smartcold.bgzigbee.manage.entity.AdminEntity;
import com.smartcold.bgzigbee.manage.entity.CookieEntity;
import com.smartcold.bgzigbee.manage.service.CookieService;
import com.smartcold.bgzigbee.manage.util.EncodeUtil;
import com.smartcold.bgzigbee.manage.util.ResponseData;
import com.smartcold.bgzigbee.manage.util.StringUtil;
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
	
	private static List<ACLAdminNode> ml=new ArrayList<ACLAdminNode>();

	
	/**2017-10-12日过期
	 * @param request
	 * @param adminName
	 * @param adminPwd
	 * @param sik
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/login",method= RequestMethod.POST)
	@ResponseBody
	public Object login(HttpServletRequest request, @RequestParam(value="adminName",required=true) String adminName,@RequestParam(value="adminPwd",required=true) String adminPwd,@RequestParam(value="sik",required=true)  Integer sik) {
		try {
			if(sik!=Calendar.getInstance().get(Calendar.HOUR_OF_DAY)){ return ResponseData.newFailure("登录过于频繁，请24小时后再试!");}
			adminPwd = EncodeUtil.encodeByMD5(adminPwd);
			AdminEntity admin = adminDao.findAdmin(adminName, adminPwd);
			if (admin != null&&admin.getRole()>=0) {
				String cookie = cookieService.insertCookie(adminName);
			    admin.setAdminpwd(null);
			    admin.setToken(cookie);
				request.getSession().setAttribute("admin", admin);
				return	ResponseData.newSuccess(String.format("systoken=%s", cookie));
			}
			return ResponseData.newFailure("用户名或者密码不正确！");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("数据连接异常！请稍后重试！");
		}
	}
	
	/**
	 * 
	 * @param request
	 * @param adminName
	 * @param adminPwd
	 * @param sik //:会话拦截标识
	 * @param uip //本次登录信息
	 * @return
	 */
	@RequestMapping(value = "/userlogin",method= RequestMethod.POST)
	@ResponseBody
	public Object userlogin(HttpServletRequest request,@RequestParam(value="adminName",required=true) String adminName,@RequestParam(value="adminPwd",required=true) String adminPwd,@RequestParam(value="sik",required=true)  Integer sik,String lip,String uip) {
		try {
			if(sik==null||sik!=Calendar.getInstance().get(Calendar.HOUR_OF_DAY)){ return ResponseData.newFailure("登录过于频繁，请24小时后再试!");}
			this.logout(request);
			adminPwd = EncodeUtil.encodeByMD5(adminPwd);
			AdminEntity admin = adminDao.findAdmin(adminName, adminPwd);
			if (admin != null) {
				String cookie = cookieService.insertCookie(adminName);
				admin.setToken(cookie);
				admin.setCuttlogininfo(uip);
				admin.setLastlogininfo(lip);
			    admin.setAdminpwd(null);
				request.getSession().setAttribute("admin", admin.clone());
				admin.setAcl(null);
				HashMap<String, Object> resdata=new HashMap<String, Object>();
				resdata.put("user", admin);
				resdata.put("SID", request.getSession().getId());
				resdata.put("systoke", String.format("systoke=%s", cookie));
				resdata.put("sltoken", StringUtil.getToken(admin.getAdminname()));
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
		if(cookies==null||cookies.length==0){return true;}
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals("systoke")) {
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
		if(admin!=null&&admin.getId()!=0){AdminEntity newdmin=admin.clone();newdmin.setAcl(null);  return ResponseData.newSuccess(newdmin);}
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("systoke")) {
					CookieEntity effectiveCookie = cookieService
							.findEffectiveCookie(cookie.getValue());
					if (effectiveCookie != null) {
						admin = adminDao.findAdminByName(effectiveCookie.getUsername());
						if(admin==null)return ResponseData.newSuccess(new AdminEntity());
						admin.setAdminpwd(null);
						admin.setToken(cookie.getValue());
						request.getSession().setAttribute("admin", admin.clone());
						admin.setAcl(null);
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
	
	
	@ResponseBody
	@RequestMapping(value = "/getUserMenu")
	public Object getUserMenu(HttpServletRequest request) {
		AdminEntity admin = (AdminEntity)request.getSession().getAttribute("admin");
		if(admin!=null&&admin.getId()!=0&&StringUtil.isnotNull(admin.getAcl())){
			return getml(admin.getAcl());
		}
		return "false";
	}
	
	public List<ACLAdminNode> getml(String alc) {
		List<ACLAdminNode> ml = getMenu();
		List<ACLAdminNode> nml=new ArrayList<ACLAdminNode>();
		String[] split = alc.split("-");
		String pacl=split[0];
		String[] cacl=split[1].split("@");
		int index=0,sindex=0,mlsize=ml.size();
//		if(pacl.length()!=cacl.length){System.err.println("无效权限！");return null;}
		for (char fix : pacl.toCharArray()) {
			index=Integer.parseInt(fix+"");
			if(index<mlsize){
				ACLAdminNode aclAdminNode = ml.get(index);
				List<ACLAdminNode> child = aclAdminNode.getChild();
				List<ACLAdminNode> nchild = new ArrayList<ACLAdminNode>();
				if(StringUtil.isnotNull(cacl[index])){
					for (char sfix : cacl[index].toCharArray()) {
						sindex=Integer.parseInt(sfix+"");
						if(sindex<child.size()){
							nchild.add(child.get(sindex));
						}
				    }
					aclAdminNode.setChild(nchild);
					nml.add(aclAdminNode);
				}
				
			}
		}
		return nml;
	}

	private List<ACLAdminNode> getMenu() {
		if(ml.size()>0){return ml;}
		ACLAdminNode pml = new ACLAdminNode("0","main_platform",      "链库管理");
		List<ACLAdminNode> mlList0=new ArrayList<ACLAdminNode>();
		mlList0.add(new ACLAdminNode("0_0","icon-user",      "用户管理",      "user_manage.html"       ));
		mlList0.add(new ACLAdminNode("0_1","icon-cold",      "冷库管理",      "rdc_manage.html"        ));
		mlList0.add(new ACLAdminNode("0_2","main_share",     "共享管理",      "rdc_ShareInfo.html"     ));
		mlList0.add(new ACLAdminNode("0_3","main_ad",     "广告管理",         ""     ));
		mlList0.add(new ACLAdminNode("0_4","icon-authe",     "认证管理",      "rdc_authen.html"        ));
		mlList0.add(new ACLAdminNode("0_5","main_infmation", "资讯管理",      ""      ));
		mlList0.add(new ACLAdminNode("0_6","icon-yy", "预约演示",      "appointment.html"      ));
		mlList0.add(new ACLAdminNode("0_7","icon-coldcf",    "冷库配置"   ,   "storageConfig.html"      ));
		pml.setChild(mlList0);ml.add(pml);
		
	    pml  = new ACLAdminNode("1"  ,"main_dev",     "设备管理");
	    List<ACLAdminNode> mlList1=new ArrayList<ACLAdminNode>();
		mlList1.add(new ACLAdminNode("1_0","dev_mang",    "设备管理",     "dev_manage.html"     ));
		mlList1.add(new ACLAdminNode("1_1","icon-role",    "设备查询",     ""     ));
		mlList1.add(new ACLAdminNode("1_2","icon-role",    "设备检测",     ""     ));
		mlList1.add(new ACLAdminNode("1_3","dev_data",     "数据查询",     "dev_data.html" ));
		mlList1.add(new ACLAdminNode("1_4","idev_port" ,   "数据监控",       "bug_port.html"  ));
		mlList1.add(new ACLAdminNode("1_5","dev_warning" , "设备告警",     "dev_msg.html"  ));
		pml.setChild(mlList1); ml.add(pml);
		
		pml  = new ACLAdminNode("2"  ,"main_360",  "360管理");
	    List<ACLAdminNode> mlList2=new ArrayList<ACLAdminNode>();
		mlList2.add(new ACLAdminNode("2_0","main_company",    "集团管理", "company_manage.html" ));
		mlList2.add(new ACLAdminNode("2_1","icon-role",    "权限配置", "" ));
		mlList2.add(new ACLAdminNode("2_2","icon-role",    "360配置",  "spiderConfig.html" ));
		mlList2.add(new ACLAdminNode("2_3","icon-role",     "报表管理", "" ));
		mlList2.add(new ACLAdminNode("2_4","main_relating" , "关联管理", "relating_manage.html" ));
		mlList2.add(new ACLAdminNode("2_5","main_kv" , "键值管理", "kv_manage.html" ));
		pml.setChild(mlList2);  ml.add(pml);
		
		pml  = new ACLAdminNode("3"  ,"main_coun",  "网站统计");
		 List<ACLAdminNode> mlList3=new ArrayList<ACLAdminNode>();
		mlList3.add(new ACLAdminNode("3_0","icon-role",    "网站统计", "" ));
		mlList3.add(new ACLAdminNode("3_1","icon-role",    "轨迹分析", "" ));
		mlList3.add(new ACLAdminNode("3_2","icon-role",    "用户体验",  "" ));
		pml.setChild(mlList3);     ml.add(pml);
		
		pml  = new ACLAdminNode("4"  ,"main_sys",     "系统管理");
		 List<ACLAdminNode> mlList4=new ArrayList<ACLAdminNode>();
		mlList4.add(new ACLAdminNode("4_0","icon-role",    "系统消息", "sys_msg.html" ));
		mlList4.add(new ACLAdminNode("4_1","icon-role",    "系统状态", "sys_state.html" ));
		pml.setChild(mlList4);    ml.add(pml);
		
		pml  = new ACLAdminNode("5"  ,"main_debug",    "开发人员");
	    List<ACLAdminNode> mlList5=new ArrayList<ACLAdminNode>();
		mlList5.add(new ACLAdminNode("5_0","icon-role",    "接口监控", "bug_port.html" ));
		mlList5.add(new ACLAdminNode("5_1","icon-role",    "日志查询", "sys_msg.html" ));
		mlList5.add(new ACLAdminNode("5_2","icon-role",    "缓存管理", "sys_state.html" ));
		mlList5.add(new ACLAdminNode("5_3","icon-role",    "任务调度", "bug/bug_task.html" ));
		pml.setChild(mlList5);      ml.add(pml);

		pml  = new ACLAdminNode("6"  ,"main_companyInner",    "企业内部");
		List<ACLAdminNode> mlList6=new ArrayList<ACLAdminNode>();
		mlList6.add(new ACLAdminNode("6_0","main_companyAcl",    "权限管理", "company_acl.html" ));
		pml.setChild(mlList6);      ml.add(pml);
		return ml;
	}
	
}
