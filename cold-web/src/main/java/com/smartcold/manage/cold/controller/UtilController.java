package com.smartcold.manage.cold.controller;


import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.api.DFSCollectionController;
import com.smartcold.manage.cold.service.task.ZsDevService;
import com.smartcold.manage.cold.util.StringUtil;


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
	
	
	@RequestMapping(value = "/del_dfsconfig")
	@ResponseBody
	public Object delconfig(String toke,String rdcid){
		if(StringUtil.verifyToken(toke)&&StringUtil.isnotNull(rdcid)){
				if("ALL".equals(rdcid)){
					 DFSCollectionController.configchcateHashMap.clear();
				}else {//if(DFSCollectionController.configchcateHashMap.containsKey(rdcid))
					 DFSCollectionController.configchcateHashMap.remove(rdcid);
				}
				return true;
			}
		return false;
	}
	
	
	//=====================================================洲斯数据接口管理==========================================================================================================================
	 @RequestMapping("/getZSserStatus")//获得洲斯服务状态
	 public Boolean getZSserStatus()  {	return ZsDevService.isRuning();}
	 @RequestMapping("/setZSserStatus")//修改服务状态
	 public Boolean setZSserStatus(boolean isRuning,String toke )  {if(StringUtil.verifyToken(toke)){ ZsDevService.setRuning(isRuning); return ZsDevService.isRuning();}else{return false;}}// 
	 @RequestMapping("/getSYSMemory") //获得主机内存//内存总数//最大可用内存//当前JVM空闲内存-- double free1 = max - total + free;//JVM实际可用内存
	 public Long [] getSYSMemory()  { Runtime runtime = Runtime.getRuntime();return new Long []{runtime.totalMemory()/1048576,runtime.maxMemory()/1048576,runtime.freeMemory()/1048576};}
	 
	
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
//    	resMap.put("MSI", ZsDevService.MSI);
//    	resMap.put("DU", ZsDevService.DU);
//    	resMap.put("APMSI", ZsDevService.APMSI);
    	return resMap;
    }
    
    
    
  
    
    
    
 
	
	
}
