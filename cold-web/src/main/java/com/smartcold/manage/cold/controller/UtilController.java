package com.smartcold.manage.cold.controller;


import java.util.Date;
import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.service.task.ZsDevService;
import com.smartcold.manage.cold.util.EncodeUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;



@Controller
@RequestMapping(value = "/util")
public class UtilController extends BaseController {
	
	
	 private boolean verifyToken(String toke){
		   if(StringUtil.isnotNull(toke)){
			   return EncodeUtil.encodeByMD5("admin"+TimeUtil.getDateHour(new Date())).equals(toke);
		   }
		   return true;
	}
	 
	 @RequestMapping("/getSensorhistData")
	 @ResponseBody
	 public Object getSensorhistData()  {
		return ZsDevService.data;
	 }
	
    @RequestMapping(value = "/del_devcache",method=  RequestMethod.GET)
    @ResponseBody
    public boolean deldevcache(String toke){
//		if(verifyToken(toke)){
			ZsDevService.clerCache();	return true;
//			}return false;
    }
    
    @RequestMapping(value = "/getZsDevStatus",method=  RequestMethod.GET)
    @ResponseBody
    public Object getZsDevStatus(){
    	HashMap<String, HashMap<String, Object>> resMap=new HashMap<String, HashMap<String, Object>>();
    	resMap.put("MSI", ZsDevService.MSI);
    	resMap.put("DU", ZsDevService.DU);
    	resMap.put("APMSI", ZsDevService.APMSI);
    	return resMap;
    }
    
    
    
    
 
	
	
}
