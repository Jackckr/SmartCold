package com.smartcold.manage.cold.controller;


import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.service.task.ZsDevService;


/**
 * 系統工具類
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/util")
public class UtilController extends BaseController {
	
	 /**
	  * 
	  * @return
	  */
	 @Deprecated
	 @RequestMapping("/getSensorhistData")
	 @ResponseBody
	 public Object getSensorhistData()  {
		return ZsDevService.data;
	 }
	
	 
	 
	 @Deprecated 
    @RequestMapping(value = "/del_devcache",method=  RequestMethod.GET)
    @ResponseBody
    public boolean deldevcache(String toke){
//		if(verifyToken(toke)){
			ZsDevService.clerCache();	return true;
//			}return false;
    }
	@Deprecated
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
