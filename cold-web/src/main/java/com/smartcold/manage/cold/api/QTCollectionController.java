package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
//		long cutime=System.currentTimeMillis(),exptime=0;
		try {
			if(StringUtil.isNull(data)){return DataResultDto.newFailure();}
			 this.cacheService.putData("dev:dev_data:"+apID, data);//缓存数据 -----防止需要
			Map<String, Object> dataMap = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			if(dataMap.containsKey("infos")){
				 apID = dataMap.get("apID").toString();
				 this.cacheService.putData("dev_data_"+apID, data);//缓存数据 -----防止需要
//				 this.cacheService.putData("dev:dev_status:"+apID, cutime);//记录设备最后通讯时间
				 ItemConf rdcspconf = this.rdcConfService.findRdcConfByDevId(apID);
				 if(rdcspconf!=null){ 
					 rdcid=rdcspconf.getRdcid();
					 this.batchData(Integer.toString(rdcid),dataMap);//保存数据  建议由数据中心处理  ---和丹弗斯一样
				 }
			}
			Boolean cisupdat = this.cacheService.getData("dev:dev_isup:"+apID);
			if(cisupdat!=null&&cisupdat){cisupdat=true;  cacheService.removeKey("dev:dev_isup:"+apID);}else{cisupdat=false;}
			System.err.println("收到 QT数据："+apID+"==================== 是否更新数据："+cisupdat+"时间"+TimeUtil.getDateTime()+data);
		   return DataResultDto.newSuccess(cisupdat);//更新数据服务
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到QT数据解析异常：\r\n"+data);
			return DataResultDto.newFailure();
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
			Integer  pl = this.cacheService.getData("dev:dev_PL:"+apID);if(pl!=null){	resMap.put("PL", pl);}
			HashMap<String, Object> confdata= this.cacheService.getData("dev:dev_upconf:"+apID);
			this.cacheService.removeKey("dev:dev_isup:"+apID);
			this.cacheService.removeKey("dev:dev_PL:"+apID);
			this.cacheService.removeKey("dev:dev_upconf:"+apID);
			if(confdata==null){ System.err.println(" 配置异常====");return resMap;}
			HashMap<String, Object> tempmap=null;
			List<HashMap<String, Object>> infoHashMaps=new ArrayList<>();
			for (String key : confdata.keySet()) {
				tempmap=new HashMap<>();
				tempmap.put("tagname", key);
				tempmap.put("value", confdata.get(key));
				infoHashMaps.add(tempmap);
			}
		    resMap.put("infos", infoHashMaps);
		    String msg=	TimeUtil.getDateTime()+  "更新"+apID+"配置:"+JSON.toJSONString(infoHashMaps)+"\r\n";
			System.err.println(msg);
			//系统记录日志
			 List<String> loglist=	this.cacheService.getData("dev:dev_upconlog:"+apID);
			 if(SetUtil.isNullList(loglist)){loglist=new ArrayList<>();}
			 loglist.add(msg);
			 this.cacheService.putData("dev:dev_upconlog:"+apID,loglist);
			 
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
		if(pl!=null){ this.cacheService.putData("dev:dev_PL:"+apid, pl);}
         this.cacheService.putData("dev:dev_isup:"+apid, true);//缓存数据 -----防止需要
         HashMap<String, Object> confdata=this.cacheService.getData("dev:dev_upconf:"+apid);
         if(SetUtil.isNullMap(confdata)){ confdata=new HashMap<>(); } confdata.put(key,val);
         //记录操作者日志 
         this.cacheService.putData("dev:dev_upconf:"+apid,confdata);
	     return true;
	} 
	
	
	/**
	 *获得设备最后上传的数据
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getQTData")
	@ResponseBody
	public ResponseData<String>  getQTData(String apid) {
			String data=cacheService.getData("dev:dev_data:"+apid);
			return ResponseData.newSuccess(data);
	}
	
	/**
	 *获得dev 操作日志
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getQTUPlog")
	@ResponseBody
	public Object getQTUPlog(String apid) {
			return this.cacheService.getData("dev:dev_upconlog:"+apid);
	}
	
	//============================================================================================================================================================================================================================================================

	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
//	@RequestMapping(value = "/getQTConfig")
//	@ResponseBody
//	public HashMap<String, Object>  getQTConfig(String apid) {
//		 List<HashMap<String, Object>> list = updateData.get(apid);
//		 HashMap<String, Object> hashMap = new HashMap<>();
//		 hashMap.put("PL",this.cacheService.getData("dev:dev_PL:"+apid));
//		 list.add(hashMap);
//		return hashMap;
//	}

//	/**
//	 *http DEV数据上传接口
//	 * @param data
//	 * @param response
//	 * @return
//	 */
//	@RequestMapping(value = "/getQTERRMsg")
//	@ResponseBody
//	public Object getQTERRMsg(String apid) {
//		if(errMap.containsKey(apid)){
//			return errMap.get(apid);
//		}
//		return ResponseData.newFailure("没有数据");
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
	 /**
	  * 数据保存接口
	  * @param rdcid
	  * @param dataMap
	  */
	 @SuppressWarnings("unchecked")
	 private void batchData(String rdcid,Map<String, Object> dataMap){
		   System.err.println(rdcid+":"+dataMap);
			HashMap<String, ItemValue> config =this.rdcConfService.getConfigByRdcId(rdcid);
//			HashMap<String, ConversionEntity> unitConvers = this.rdcConfService.getConverByrdcId(rdcid);
	        if(config==null||config.size()==0){return;}
	        Date date = new Date();
		    ArrayList<ItemValue> dataList = null;
		    String table =null;  ItemValue newdata=null;
		    String cutttime=TimeUtil.getDateTime();
		    ArrayList<WarningsInfo> wardataList = new ArrayList<WarningsInfo>();
		    HashMap<String, ArrayList<ItemValue>> tempMap=new HashMap<String, ArrayList<ItemValue>>();
		 
			List<Map<String, String>> dataMapList=   ((List<Map<String, String>>) dataMap.get("infos"));
		    for (Map<String, String> info : dataMapList) {
		    	for (Map.Entry<String, String> entry : info.entrySet()) {
					String name=entry.getKey(),  valueString=entry.getValue();
		    	//当前是告警信息
			    	if(name.indexOf("警")>-1){if("1".equals(valueString)){wardataList.add(new WarningsInfo(name,Integer.parseInt(rdcid),1,date));}continue;}
			    	newdata = config.get(name);
			    	if(newdata==null){ continue;}
//		    	if(unitConvers!=null&&unitConvers.containsKey(name)){//unitConvers 数据转换集合->电压  ，压力转换
//				     if(! counsValue(unitConvers, newdata, info, name)){ continue;}//  加入转换对象
//		    	}else{
		    		 newdata.setValue(valueString);
					 newdata.setTime(cutttime);//info.get("lasttime")
//		    	}
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
			}
			if(SetUtil.isNotNullMap(tempMap)){
				for (String key : tempMap.keySet()) {
					try {
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
		
	
	
}
