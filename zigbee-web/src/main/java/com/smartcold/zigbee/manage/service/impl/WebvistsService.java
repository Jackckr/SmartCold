package com.smartcold.zigbee.manage.service.impl;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.zigbee.manage.dao.WebvisitMapper;
import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.listener.SessionListener;
import com.smartcold.zigbee.manage.util.SetUtil;
import com.smartcold.zigbee.manage.util.StringUtil;

@Service
public class WebvistsService  {
	
	private static int release = 0; // -6
	private static int share = 0; // -3
	
	private static int coldlist = 0; // 1
	private static int map = 0; // 2
	private static int position = 0; // 3
	private static int good = 0; // 4
	private static int car = 0; // 5
	private static int rrdc = 0; // 6
	private static int rposition = 0; // 7
	private static int rgood = 0; // 8
	private static int rcar = 0; // 9
	private static int traces = 0; // 10
	private static int sc360 = 0; // 11
	private static int news = 0; // 12
	private static int msg =0; // 13
    
	@Autowired
	private  WebvisitMapper webvisit;
	
	
	public static LinkedList<String> sessionlist = new LinkedList<String>();
	
	public static LinkedList<HashMap<String, Object>> webaccectList = new LinkedList<HashMap<String, Object>>();
	
//	private final static String[] Telephone  = {"Android", "iPhone", "iPod","iPad", "Windows Phone"  };
//	private final static String[] system  = { "Android", "iPhone", "iPod","iPad", "Windows Phone" ,"Windows", "Mac","Linux","Solaris","FreeBSD" };
//	private final static String[] browser =   {"MSIE", "UCWEB","UCBrowser","opera","SE","MetaSr","SogouMobileBrowser","chrome","safari","Firefox","TencentTraveler","QQBrowser","360SE","The world"};
//	private final static String[] browsername={"IE","UC","UC","opera","搜狗浏览器","搜狗浏览器","搜狗浏览器","chrome","safari","Firefox","QQ 浏览器","QQ 浏览器","360浏览器","Theworld"}; 
	
	public static void addSessionInfo(String key) {sessionlist.add(key);}
	
	public static void addCount(HttpServletRequest request, int index) {
		switch (index) {
		case -6: release++; break;
		case -3: share++; break;
		case 1: coldlist++; break;
		case 2: map++; break;
		case 3: position++; break;
		case 4: good++; break;
		case 5: car++; break;
		case 6: rrdc++; break;
		case 7: rposition++; break;
		case 8: rgood++; break;
		case 9: rcar++; break;
		case 10: traces++; break;
		case 11: sc360++; break;
		case 12: news++; break;
		case 13: msg++; break;
		default: break;
		}
		if(sessionlist.contains(request.getSession().getId())){
			sessionlist.remove(request.getSession().getId());
			WebvistsService.checkAgentIsMobile(request);
		}
	}
	
	/**
	 * 半小时自动保存一次
	 * 	
	 */
	@Scheduled(cron = "0 0/30 * * * ?")
	private void saveCount() {
		if (share    != 0) { webvisit.updateWebvisits( -3, share);share = 0;}
		if (release  != 0) { webvisit.updateWebvisits( -6, release);release = 0;}
		if (coldlist != 0) { webvisit.updateWebvisits( 1, coldlist);coldlist = 0;}
		if (map      != 0) { webvisit.updateWebvisits( 2, map );map = 0;}
		if (position != 0) { webvisit.updateWebvisits( 3, position ); position = 0; }
		if (good     != 0) { webvisit.updateWebvisits( 4, good ); good = 0; }
		if (car      != 0) { webvisit.updateWebvisits( 5, car ); car = 0; }
		if (rrdc     != 0) { webvisit.updateWebvisits( 6, rrdc); rrdc = 0; }
		if (rposition!= 0) { webvisit.updateWebvisits( 7, rposition  ); rposition = 0; }
		if (rgood    != 0) { webvisit.updateWebvisits( 8, rgood ); rgood = 0; }
		if (rcar     != 0) { webvisit.updateWebvisits( 9, rcar ); rcar = 0; }
		if (traces   != 0) { webvisit.updateWebvisits( 10, traces ); traces = 0; }
		if (sc360    != 0) { webvisit.updateWebvisits( 11, sc360 ); sc360 = 0; }
		if (news     != 0) { webvisit.updateWebvisits( 12, news ); news = 0; }
		if (msg      != 0) { webvisit.updateWebvisits( 13, msg); msg = 0; }
		sessionlist.clear();
		if(SetUtil.isnotNullList(webaccectList)){
			webvisit.addwebAcceslist(webaccectList);
			webaccectList.clear();
		}
	}

	
	


	private static String  getuser(HttpServletRequest request){
		UserEntity user = (UserEntity)request.getSession().getAttribute("user");
		if(user!=null){return user.getNickname()+"-"+user.getRealname();}
		return "游客访问";
	}
	
	
	/**
	 * 获得用户IP
	 * @param request
	 * @return
	 */
	private static String getIpAddr(HttpServletRequest request) {  
		String ipAddress = null;  
		ipAddress = request.getHeader("x-forwarded-for");  
		if (ipAddress == null || ipAddress.length() == 0  
		        || "unknown".equalsIgnoreCase(ipAddress)) {  
		    ipAddress = request.getHeader("Proxy-Client-IP");  
		}  
		if (ipAddress == null || ipAddress.length() == 0  
		        || "unknown".equalsIgnoreCase(ipAddress)) {  
		    ipAddress = request.getHeader("WL-Proxy-Client-IP");  
		}  
		if (ipAddress == null || ipAddress.length() == 0  
		        || "unknown".equalsIgnoreCase(ipAddress)) {  
		    ipAddress = request.getRemoteAddr();  
		          
		    //这里主要是获取本机的ip,可有可无  
		    if (ipAddress.equals("127.0.0.1")  
		            || ipAddress.endsWith("0:0:0:0:0:0:1")) {  
		        // 根据网卡取本机配置的IP  
		        InetAddress inet = null;  
		        try {  
		            inet = InetAddress.getLocalHost();  
		        } catch (UnknownHostException e) {  
		            e.printStackTrace();  
		        }  
		        ipAddress = inet.getHostAddress();  
		    }  
		  
		}  
		// 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割  
		if (ipAddress != null && ipAddress.length() > 15) { // "***.***.***.***".length()  
		    if (ipAddress.indexOf(",") > 0) {  
		        ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));  
		    }  
		}  
		return ipAddress;  
	}  
	public static void  checkAgentIsMobile(HttpServletRequest request) {
		  HashMap<String, Object>   temp=new HashMap<String, Object>();
		  String userAgent=request.getHeader("User-Agent");
		  int sysindex = userAgent.indexOf(")");
	    	int bloweridx=  userAgent.lastIndexOf(")");
		  String os[]=userAgent.substring(userAgent.indexOf("(")+1,sysindex).split(";");//获得系统名称
		  String age=userAgent.substring(bloweridx+1).trim();//获得系统名称
		   if(StringUtil.isnotNull(age)){//非ie os[0]
			   String[] split = age.split(" ");  
			   if(os.length==2){
				   temp.put("sysinfo", os[0]);
				}else if(os.length==3){
					 temp.put("sysinfo", os[1]);
				}else{ 
					 temp.put("sysinfo", os[0]);
				}
			   if(split.length>2){
				   String bros="";
				    for (int i = 1; i < split.length; i++) {
					 bros+=split[i]+" ";
			    	}
				   temp.put("browinfo",bros);
			   }else{
				   temp.put("browinfo", split[split.length-1]);
			   }
		   }else{//处理IE内核
			   temp.put("sysinfo", os[2]);
			   temp.put("browinfo",os[1]);
		   }
		   temp.put("ip", getIpAddr(request));
		   temp.put("userinfo", getuser(request));
		   temp.put("online",SessionListener.getonlineUser());
		   webaccectList.add(temp);
	}
	
	public static List<Object[]> getCount(){
		List<Object[]> datalist = new ArrayList<Object[]>();
		datalist.add(new Object[] {"冷库 " ,          coldlist        });
		datalist.add(new Object[] {"地图" ,          map             });
		datalist.add(new Object[] {"共享" ,          share        });
		datalist.add(new Object[] {"仓位 " ,          position        });
		datalist.add(new Object[] {"货品" ,          good            });
		datalist.add(new Object[] {"货运" ,          car             });
		datalist.add(new Object[] {"发布" ,          release        });
		datalist.add(new Object[] {"发布冷库",          rrdc            });
		datalist.add(new Object[] {"发布仓位",          rposition       });
		datalist.add(new Object[] {"发布货品",          rgood           });
		datalist.add(new Object[] {"发布冷运",          rcar            });
		datalist.add(new Object[] {"追溯"  ,          traces          });
		datalist.add(new Object[] {"360"  ,          sc360  });
		datalist.add(new Object[] {"资讯"  ,          news            });
		datalist.add(new Object[] {"消息"  ,          msg             });
	   return datalist;  
	} 
}
