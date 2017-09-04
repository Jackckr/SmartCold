package com.smartcold.manage.cold.api;

import java.util.ArrayList;
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

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dao.newdb.DevStatusMapper;
import com.smartcold.manage.cold.dao.newdb.StorageDataCollectionMapper;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.util.ResponseData;
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
	public   DevStatusMapper devplset;
	
	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;
    
	private static HashMap<String, Long> splittimeHashMap=new HashMap<>();
	private static HashMap<String, Boolean> isupdate=new HashMap<String, Boolean>();
	private static HashMap<String, Integer> plMap=new HashMap<String, Integer>();
	private static HashMap<String, List<String []>> errMap=new HashMap<String ,List<String []>>();
	private static HashMap<String, HashMap<String, Object>> updateData=new HashMap<String, HashMap<String, Object>>();
    private static String alldata="";
    private static boolean ispring=true;
	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/updateConfig")
	@ResponseBody
	public boolean updateConfig(String apid,Integer pl,String key,String val) {
		 plMap.put(apid, pl);
		 isupdate.put(apid, true);
		 HashMap<String, Object> dataHashMap=new HashMap<>();
         dataHashMap.put("tagname", key);
         dataHashMap.put("value", val);
         updateData.put(apid,dataHashMap);
	     return true;
	} 
	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/getQTConfig")
	@ResponseBody
	public HashMap<String, Object>  getQTConfig(String apid) {
		HashMap<String, Object> hashMap = updateData.get(apid);
		hashMap.put("PL", plMap.get(apid));
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
	public ResponseData<String>  getQTData() {
			String dString=alldata;
			alldata="";
			return ResponseData.newSuccess(dString);
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
	@RequestMapping(value = "/QTispring")
	@ResponseBody
	public void QTispring() {
		ispring=!ispring;
	}
	 
	
	   /**
	 	 * 10分钟检查一次
	 	 * Task:检查AP
	 	 * 超过系统规定时间 ，发送短信通知。。
	 	 * 
	 	 */
		@Scheduled(cron = "0 0/1 * * * ?")
		public void checkAPStatus() {
			try {
				for (String key : splittimeHashMap.keySet()) {
				  if(	System.currentTimeMillis()-	splittimeHashMap.get(key)>60000){
					
					  if(errMap.containsKey(key)){
							List<String[]> list = errMap.get(key);
							if(list.size()>0){
								String [] longs = list.get(list.size()-1);//取末端数据
								if(StringUtil.isNull(longs[0])){
									longs[0]=TimeUtil.getDateTime();
								}
								else if(StringUtil.isNull(longs[2])){
									longs[1]=(Integer.parseInt(longs[1])+1)+"";
								}else{
									String [] longs1 =new String[]{TimeUtil.getDateTime(),"1",""};
									list.add(longs1);
								}
							}else{
								String [] longs =new String[]{TimeUtil.getDateTime(),"1",""};
								list.add(longs);
							}
						}else{
							String [] longs =new String[]{TimeUtil.getDateTime(),"1",""};
							List<String []> list=new ArrayList<String []>();
							list.add(longs);
							errMap.put(key, list);
						}
				  }
				}
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		
		private void restAp(String apid){
			if(errMap.containsKey(apid)){
				List<String[]> list = errMap.get(apid);
				if(list.size()>0){
					String [] longs = list.get(list.size()-1);//取末端数据
					if(StringUtil.isNull(longs[2])){
						longs[2]=TimeUtil.getDateTime();
					}
				}
			}
		}
	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/QTDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object QTDataCollection(@RequestBody String data) {		long cutime=System.currentTimeMillis(),exptime=0;boolean cisupdat=false;;
		 String apID="";
		 
		try {
//			System.out.println(data);
			if(StringUtil.isNull(data)){return DataResultDto.newFailure();}
			
			Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			if(dataCollectionBatchEntity.containsKey("infos")){
				 apID = dataCollectionBatchEntity.get("apID").toString();
				 if(splittimeHashMap.containsKey(apID)){
					 exptime = cutime-splittimeHashMap.get(apID);
				 }
				 splittimeHashMap.put(apID, cutime);
				 restAp(apID);
//				System.err.println(apID);
//				 if("400333444".equals(apID)&&ispring){
//					 ArrayList<StorageDataCollectionEntity> arrayList = new ArrayList<StorageDataCollectionEntity>();
						for (Map<String, String> info : (List<Map<String, String>>) dataCollectionBatchEntity.get("infos")) {
							System.err.println(info);
							alldata=data+"时间："+TimeUtil.getDateTime();
//							Date time = new Date(Long.parseLong(info.remove("time")) * 1000);
//							String deviceId = info.remove("devID").toString();
//							for (Entry<String, String> item : info.entrySet()) {
//								arrayList.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
//							}
						}
//				 }
				
				
			}
			if(isupdate.containsKey(apID)){
				cisupdat=true;
				isupdate.remove(apID);
			}
			System.err.println("收到 QT数据："+apID+"====================间隔时间："+exptime+" 是否更新数据："+cisupdat+"时间"+TimeUtil.getDateTime());
		   return DataResultDto.newSuccess(cisupdat);//更新数据服务
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到QT数据解析异常：\r\n"+data);
			return DataResultDto.newFailure();
		}
	} 
	
	
	/**
	 * DEV校时
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
			if(plMap.containsKey(apID)&&plMap.get(apID)!=null){	resMap.put("PL", Integer.toString(plMap.get(apID)));}
			List<HashMap<String, Object>> infoHashMaps=new ArrayList<HashMap<String, Object>>();
			if(updateData.containsKey(apID)){
		     	infoHashMaps.add(updateData.get(apID));
			}else{//去数据库查。。。
				
			}
		    resMap.put("infos", infoHashMaps);
			System.err.println("更新"+apID+"配置=====================================");
			return resMap;
		} catch (Exception e) {
			return DataResultDto.newFailure();
		}
	
	}  

}
