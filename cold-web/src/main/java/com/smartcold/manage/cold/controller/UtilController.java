package com.smartcold.manage.cold.controller;


import java.util.HashMap;
import java.util.LinkedList;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.api.DFSCollectionController;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.jobs.taskutil.QuartzManager;
import com.smartcold.manage.cold.service.task.WarningTaskService;
import com.smartcold.manage.cold.service.task.ZsDevService;
import com.smartcold.manage.cold.util.CacheManager;
import com.smartcold.manage.cold.util.EncodeUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;


/**
 * 系統工具類
 * @author Administrator
 *
 */
@Controller
@ResponseBody
@RequestMapping(value = "/util")
public class UtilController extends BaseController {
	
	//=====================================================北京中威=========================================================================================================================
	@RequestMapping("/getZWData") 
	public Object getZWData()  {return CacheManager.zwdataList;}
	//=====================================================丹弗斯数据接口管理=========================================================================================================================
	@RequestMapping("/getDFSData")
	public String getDFSData()  {return DFSCollectionController.dfsdata;}
	 @RequestMapping(value = "/gettoke")
	 public String gettoke(String toke){if(("admin"+TimeUtil.getDateHour()).equals(toke)){ return EncodeUtil.encodeByMD5("toke"+TimeUtil.getDay());}return null;}
	 @RequestMapping(value = "/del_dfsconfig")
	 public Object delconfig(String toke,String rdcid){if(StringUtil.verifyToken(toke)&&StringUtil.isnotNull(rdcid)){if("ALL".equals(rdcid)){ DFSCollectionController.configchcateHashMap.clear();}else { DFSCollectionController.configchcateHashMap.remove(rdcid);}return true;}return false;}
	 @RequestMapping(value = "/get_dfsconfig")
	 public Object getconfig(String toke,String rdcid){if(StringUtil.verifyToken(toke)&&StringUtil.isnotNull(rdcid)){ return  DFSCollectionController.configchcateHashMap.get(rdcid);} return -1; }
	 
	//=====================================================洲斯数据接口管理==========================================================================================================================
	 @RequestMapping("/getZSDevStatssaveTime")//
	 public String getZSDevStatssaveTime()  {	return ZsDevService.saveTime;}
	 @RequestMapping("/getZSserStatus")//获得洲斯服务状态
	 public Boolean getZSserStatus()  {	return ZsDevService.isRuning();}
	 @RequestMapping("/setZSserStatus")//修改服务状态
	 public Object setZSserStatus(boolean isRuning,String toke )  {if(StringUtil.verifyToken(toke)){ ZsDevService.setRuning(isRuning); return ZsDevService.isRuning();}else{return -1;}}// 
	 @RequestMapping("/getZSData") //获得主机内存//内存总数//最大可用内存//当前JVM空闲内存-- double free1 = max - total + free;//JVM实际可用内存
	 public LinkedList<String> getZSData()  {return ZsDevService.dataList;}
	 @RequestMapping(value = "/del_devcache")//删除缓存
	 public Object deldevcache(String toke){if(StringUtil.verifyToken(toke)){ZsDevService.clerCache();	return true;}return -1;}
	 @RequestMapping(value = "/getZsDevStatus")
	 public  HashMap<String, StorageDataCollectionEntity>  getZsDevStatus(int type){ switch (type) {case 1: return ZsDevService.msimap;case 2: return ZsDevService.bsimap;case 3: return ZsDevService.dumap;default:return null;}}
	 //=====================================================系统接口管理==========================================================================================================================
	 @RequestMapping("/getSYSMemory") //获得主机内存//内存总数//最大可用内存//当前JVM空闲内存-- double free1 = max - total + free;//JVM实际可用内存
	 public Long [] getSYSMemory()  { Runtime runtime = Runtime.getRuntime();return new Long []{runtime.totalMemory()/1048576,runtime.maxMemory()/1048576,runtime.freeMemory()/1048576};}
	 //============================
	 @RequestMapping("/getTempJobList") 
	 public Object getTempJobList(){return  QuartzManager.tempListen;}
	 @RequestMapping("/getTempJobBlacklist") 
	 public Object getTempJobBlacklist(){return  WarningTaskService.Blacklist;}
	 
}
