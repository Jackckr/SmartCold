package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dao.newdb.DFSDataCollectionMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.entity.comm.ItemConf;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.WarningsInfo;
import com.smartcold.manage.cold.entity.olddb.ConversionEntity;
import com.smartcold.manage.cold.service.RdcConfService;
import com.smartcold.manage.cold.service.redis.CacheService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * QT数据协议接口
 * @author Administrator
 *
 */
@Controller
public class QTCollectionController extends BaseController {

	private static Gson gson = new Gson();
	@Autowired
	private CacheService cacheService;
	@Autowired
	private RdcConfService rdcConfService;
	
	@Autowired
	private WarningsInfoMapper warningsInfoMapper;
	@Autowired
	private DFSDataCollectionMapper dataservice;
	
//	private static HashMap<String, Long> splittimeHashMap=new HashMap<>();
//	private static HashMap<String, Boolean> isupdate=new HashMap<String, Boolean>();
//	private static HashMap<String, List<String>> updateLog=new HashMap<String, List<String>>();
//	private static HashMap<String, Integer> plMap=new HashMap<String, Integer>();
	private static HashMap<String, List<String []>> errMap=new HashMap<String ,List<String []>>();
	private static HashMap<String, List<HashMap<String, Object>>> updateData=new HashMap<String, List<HashMap<String, Object>>>();

	
	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/QTDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object QTDataCollection(@RequestBody String data) {		
		String apID="";int rdcid=0;
		long cutime=System.currentTimeMillis(),exptime=0;Boolean cisupdat=false;;
		try {
			if(StringUtil.isNull(data)){return DataResultDto.newFailure();}
			Map<String, Object> dataMap = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			if(dataMap.containsKey("infos")){
				 apID = dataMap.get("apID").toString();
				 this.cacheService.putData("dev_data:"+apID, data);//缓存数据 -----防止需要
				 ItemConf rdcspconf = this.rdcConfService.findRdcConfByDevId(apID);
				 if(rdcspconf==null){ return  DataResultDto.newSuccess();}
				 rdcid=rdcspconf.getRdcid();
				 //计算设备有没有告警
//				 if(splittimeHashMap.containsKey(apID)){ exptime = cutime-splittimeHashMap.get(apID);}splittimeHashMap.put(apID, cutime);restAp(apID);
				 this.batchData(Integer.toString(rdcid),dataMap);//保存数据  建议由数据中心处理  ---和丹弗斯一样
			}
			
			cisupdat = this.cacheService.getData("dev_isup:"+apID);
			if(cisupdat!=null&&cisupdat){cisupdat=true;  cacheService.removeKey("dev_isup:"+apID);}
			System.err.println("收到 QT数据："+apID+"====================间隔时间："+exptime+" 是否更新数据："+cisupdat+"时间"+TimeUtil.getDateTime());
		   return DataResultDto.newSuccess(cisupdat);//更新数据服务
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到QT数据解析异常：\r\n"+data);
			return DataResultDto.newFailure();
		}
	} 
	private void batchData(String rdcid,Map<String, Object> dataMap){
		if(!DFSCollectionController.configchcateHashMap.containsKey(rdcid)){this.rdcConfService.getConfigByRdcId(rdcid); this.rdcConfService.getConverByrdcId(rdcid); }
		HashMap<String, ItemValue> config = DFSCollectionController.configchcateHashMap.get(rdcid);
		HashMap<String, ConversionEntity> unitConvers = DFSCollectionController.unitConversMap.get(rdcid);
        if(config==null){return;}
        Date date = new Date();
	    ArrayList<ItemValue> dataList = null;
	    String table =null;  ItemValue newdata=null;
	    String cutttime=TimeUtil.getDateTime();
	    ArrayList<WarningsInfo> wardataList = new ArrayList<WarningsInfo>();
	    HashMap<String, ArrayList<ItemValue>> tempMap=new HashMap<String, ArrayList<ItemValue>>();
	    List<Map<String, String>> dataMapList=   ((List<Map<String, String>>) dataMap.get("infos"));
	    for (Map<String, String> info : dataMapList) {
	    	String name = info.get("tagname");
	    	
	    	//当前是告警信息
	    	if(name.indexOf("警")>-1){if("1".equals(info.get("currentvalue"))){wardataList.add(new WarningsInfo(name,Integer.parseInt(rdcid),1,date));}continue;}
	    	newdata = config.get(name);if(newdata==null){ continue;}
	    	if(unitConvers!=null&&unitConvers.containsKey(name)){//unitConvers 数据转换集合->电压  ，压力转换
			     if(! counsValue(unitConvers, newdata, info, name)){ continue;}//  加入转换对象
	    	}else{
	    		 newdata.setValue(info.get("currentvalue"));
				 newdata.setTime(cutttime);//info.get("lasttime")
	    	}
			 table = newdata.getTable();
			
			 if(StringUtil.isnotNull(table)){
				 if(tempMap.containsKey(table)){//存在异常代码块
					 tempMap.get(table).add(newdata);
				}else{
					 dataList = new ArrayList<ItemValue>();
					 dataList.add(newdata);
					 tempMap.put(table, dataList);
				}
				if("isRunning,isDefrosting".indexOf(newdata.getKey())>-1){
						ItemValue clone  = (ItemValue) newdata.clone();
						if(clone!=null){
							if("isRunning".equals(newdata.getKey())){
								clone.setKey("isDefrosting");
								clone.setValue(0);
							}else{
								clone.setKey("isRunning");
								clone.setValue(0);
							}
							tempMap.get(table).add(clone);
						}
				}
			 }else{
				 System.err.println("未知保存对象"+gson.toJson(newdata));
			 }
		}
		if(SetUtil.isNotNullMap(tempMap)){
			for (String key : tempMap.keySet()) {
				try {
					System.err.println(key+":"+gson.toJson( tempMap.get(key)));
					this.dataservice.adddataList(key,  tempMap.get(key));
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		if(SetUtil.isnotNullList(wardataList)){
			try {
				this.warningsInfoMapper.addwarningsinfos(wardataList);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	
	}
	
	/**
	 * DEV更新配置
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/QTDEVConfig")//
	@ResponseBody
	public Object QTDEVConfig(@RequestBody String data) {
		try {
			String apID="";
			if(StringUtil.isNull(data)){return DataResultDto.newFailure();}
		    Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			apID = dataCollectionBatchEntity.get("apID").toString();
			LinkedHashMap<String, Object> resMap=new LinkedHashMap<String, Object>();
			resMap.put("status","200");
			resMap.put("time", TimeUtil.getMillTime());
			//判断是否有PL
			
			Integer  pl = this.cacheService.getData("dev_PL:"+apID);
			if(pl!=null){	resMap.put("PL", pl);}
			List<HashMap<String, Object>> infoHashMaps=new ArrayList<HashMap<String, Object>>();
			if(updateData.containsKey(apID)){
				infoHashMaps= updateData.get(apID);
			}else{
				//去数据库查。。。分布式--》  出现这种情况 ---->必须
				
			}
		    resMap.put("infos", infoHashMaps);
	     	String msg=  TimeUtil.getDateTime()+  "更新"+apID+"配置:"+JSON.toJSONString(infoHashMaps)+"\r\n";
			System.err.println(msg);
//			if(updateLog.containsKey(apID)){
//			     List<String> list = updateLog.get(apID);
//			     list.clear();
//			     list.add(msg);
//			}else{
//				List<String> loglist=new ArrayList<>(); 
//				loglist.add(msg);
//				updateLog.put(apID, loglist);	
//			}
			return resMap;
		} catch (Exception e) {
			e.printStackTrace();
			return DataResultDto.newFailure();
		}
	} 
	

	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/updateConfig")
	@ResponseBody
	public boolean updateConfig(String apid,Integer pl,String key,String val) {
		if(pl!=null){
			 this.cacheService.putData("dev_PL:"+apid, pl);//缓存数据 -----防止需要
		}
//		 isupdate.put(apid, true);
		 
		 this.cacheService.putData("dev_isup:"+apid, true);//缓存数据 -----防止需要
		 
		 HashMap<String, Object> dataHashMap=new HashMap<>();
         dataHashMap.put("tagname", key);
         dataHashMap.put("value", val);
         if(updateData.containsKey(apid)){
        	 List<HashMap<String, Object>> list = updateData.get(apid);
        	 list.add(dataHashMap);
         }else{//单次回写
        	 List<HashMap<String, Object>> list = new ArrayList<>();
        	 list.add(dataHashMap);
        	 updateData.put(apid, list);
         }
	     return true;
	} 
	
	
	
	
	//============================================================================================================================================================================================================================================================

	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getQTConfig")
	@ResponseBody
	public HashMap<String, Object>  getQTConfig(String apid) {
		 List<HashMap<String, Object>> list = updateData.get(apid);
		 HashMap<String, Object> hashMap = new HashMap<>();
		 hashMap.put("PL",this.cacheService.getData("dev_PL:"+apid));
		 list.add(hashMap);
		return hashMap;
	}
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getQTData")
	@ResponseBody
	public ResponseData<String>  getQTData(String apid) {
			String data=cacheService.getData("dev_data:"+apid);
			if(StringUtil.isnotNull(data)){
				return ResponseData.newSuccess(data);
			}
			return ResponseData.newSuccess("");
	}
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getQTERRMsg")
	@ResponseBody
	public Object getQTERRMsg(String apid) {
		if(errMap.containsKey(apid)){
			return errMap.get(apid);
		}
		return ResponseData.newFailure("没有数据");
	}
	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
//	@RequestMapping(value = "/getQTUPlog")
//	@ResponseBody
//	public Object getQTUPlog(String apid) {
//			return updateLog.get(apid);
//	}
	
//	 /**
//	 * 10分钟检查一次
//	 * Task:检查AP
//	 * 超过系统规定时间 ，发送短信通知。。
//	 * 
//	 */
//	@Scheduled(cron = "0 0/1 * * * ?")
//	public void checkAPStatus() {
//		try {
//			for (String key : splittimeHashMap.keySet()) {
//			  if(	System.currentTimeMillis()-	splittimeHashMap.get(key)>60000){
//				
//				  if(errMap.containsKey(key)){
//						List<String[]> list = errMap.get(key);
//						if(list.size()>0){
//							String [] longs = list.get(list.size()-1);//取末端数据
//							if(StringUtil.isNull(longs[0])){
//								longs[0]=TimeUtil.getDateTime();
//							}
//							else if(StringUtil.isNull(longs[2])){
//								longs[1]=(Integer.parseInt(longs[1])+1)+"";
//							}else{
//								String [] longs1 =new String[]{TimeUtil.getDateTime(),"1",""};
//								list.add(longs1);
//							}
//						}else{
//							String [] longs =new String[]{TimeUtil.getDateTime(),"1",""};
//							list.add(longs);
//						}
//					}else{
//						String [] longs =new String[]{TimeUtil.getDateTime(),"1",""};
//						List<String []> list=new ArrayList<String []>();
//						list.add(longs);
//						errMap.put(key, list);
//					}
//			  }
//			}
//		} catch (NumberFormatException e) {
//			e.printStackTrace();
//		}
//		
//	}
//	
//	private void restAp(String apid){
//		if(errMap.containsKey(apid)){
//			List<String[]> list = errMap.get(apid);
//			if(list.size()>0){
//				String [] longs = list.get(list.size()-1);//取末端数据
//				if(StringUtil.isNull(longs[2])){
//					longs[2]=TimeUtil.getDateTime();
//				}
//			}
//		}
//	}
	
	
	/**
	 * 根据配置进行转换
	 * @param unitConvers
	 * @param newdata
	 * @param info
	 * @param name
	 */
	 private  boolean counsValue(HashMap<String, ConversionEntity> unitConvers,ItemValue newdata, Map<String, String> info,String name) {
		String val=null;String[] key_val =null;ConversionEntity conversionEntity=null;
			 val = info.get("currentvalue");
		    		 try {
						conversionEntity= unitConvers.get(name);
						switch (conversionEntity.getType()) {
						case 1://换算
							val= (Double.parseDouble(val)*Double.parseDouble(conversionEntity.getMapping()))+"";
							newdata.setValue(val);
							return true;
						case 2://switch
							 key_val = conversionEntity.getUnit().get(val);
							 if(key_val!=null){
								    newdata.setKey(key_val[0]);
									newdata.setValue(key_val[1]);
									return true;
							 }else{
								 System.err.println("进入风机转换1：转换异常"+val);
								 return false;
							 }
						case 3://指向
							ConversionEntity conversionEntity2 = unitConvers.get(conversionEntity.getMapping());//映射解析对象  减少内存
							key_val = conversionEntity2.getUnit().get(val);
							if(key_val!=null){
								newdata.setKey(key_val[0]);
								newdata.setValue(key_val[1]);
								return true;
							}else{
								 System.err.println("进入风机转换2：转换异常"+val);
								 return false;
							}
						default:
							return false;
						}
					} catch (Exception e) {
						e.printStackTrace();
						System.err.println("转换出错！");
						return false;
					}
	} 

	
	
}
