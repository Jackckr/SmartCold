package com.smartcold.bgzigbee.manage.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.util.EncodeUtil;
import com.smartcold.bgzigbee.manage.util.TimeUtil;



/**
 * 系統工具類
 * @author Administrator
 *
 */
@Controller
@ResponseBody
@RequestMapping(value = "/util")
public class UtilController extends BaseController {
	
	
	//=====================================================丹弗斯数据接口管理=========================================================================================================================
	 @RequestMapping(value = "/gettoke",method=RequestMethod.GET)
	 public String gettoke(String token){
		 if(("!@admin"+TimeUtil.getDateHour()).equals(token)){
			 return EncodeUtil.encodeByMD5("token"+TimeUtil.getDateHour());
		}
		 return null;
		 }
	 //=====================================================系统接口管理==========================================================================================================================
	 @RequestMapping("/getSYSMemory") //获得主机内存//内存总数//最大可用内存//当前JVM空闲内存-- double free1 = max - total + free;//JVM实际可用内存
	 public Long [] getSYSMemory()  { Runtime runtime = Runtime.getRuntime();return new Long []{runtime.totalMemory()/1048576,runtime.maxMemory()/1048576,runtime.freeMemory()/1048576};}
 
	
	
}
