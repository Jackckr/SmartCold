package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 北京中威DEV数据接口
 * @author Administrator
 *
 */
@Controller
public class DataCollectionController extends BaseController {

	@Autowired
	public   DevStatusMapper devplset;
	
	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;

	private Gson gson = new Gson();

	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/dataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object storageDataCollection(@RequestBody String data, HttpServletResponse response) {
		try {
			if(StringUtil.isNull(data)){new DataResultDto(500);}
			Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			String apID = dataCollectionBatchEntity.get("apID").toString();
			ArrayList<StorageDataCollectionEntity> arrayList = new ArrayList<StorageDataCollectionEntity>();
			for (Map<String, String> info : (List<Map<String, String>>) dataCollectionBatchEntity.get("infos")) {
				Date time = new Date(Long.parseLong(info.remove("time")) * 1000);
				String deviceId = info.remove("devID").toString();
				for (Entry<String, String> item : info.entrySet()) {
					arrayList.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
				}
			}
			if(SetUtil.isnotNullList(arrayList)){
				storageDataCollectionDao.batchInsert(arrayList);
			}
		} catch (Exception e) {
			System.err.println("DEV数据解析出错。。。。。。。。。。。。\r\n"+data);
			return new DataResultDto(500);
		}
		return new DataResultDto(200);
	} 
	
	
	/**
	 * DEV校时
	 * @param data
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/schoolTime", method = RequestMethod.POST)//
	@ResponseBody
	public Object schoolTime(@RequestBody String data, HttpServletResponse response) {
		LinkedHashMap<String, Object> resMap=new LinkedHashMap<String, Object>();
		resMap.put("status","200");resMap.put("time", TimeUtil.getLongtime().toString());
		try {
			if(StringUtil.isnotNull(data)){
			    	ArrayList<StorageDataCollectionEntity> apsatusList = new ArrayList<StorageDataCollectionEntity>();
					Map<String, Object> dataMap = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
					String apID = dataMap.get("apID").toString();
					apsatusList.add(new StorageDataCollectionEntity(apID, null,"MSI", dataMap.get("MSI").toString(), new Date(Long.parseLong(dataMap.remove("time").toString()) * 1000)));
//					if(dataMap.containsKey("LAC")){apsatusList.add(new StorageDataCollectionEntity(apID, null,"LAC", dataMap.get("LAC").toString(), aptime));}
//					if(dataMap.containsKey("CID")){apsatusList.add(new StorageDataCollectionEntity(apID, null,"CID", dataMap.get("CID").toString(), aptime));}
					if(dataMap.containsKey("infos")){//数据状态包
						ArrayList<StorageDataCollectionEntity> devsatusList = new ArrayList<StorageDataCollectionEntity>();
						List<Map<String, String>> devinfos = (List<Map<String, String>>) dataMap.get("infos");
						for (Map<String, String> info : devinfos) {
							Date time = new Date(Long.parseLong(info.remove("time")) * 1000);
							String deviceId = info.remove("devID").toString();
							for (Entry<String, String> item : info.entrySet()) {
								devsatusList.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
							}
						}
						if(SetUtil.isNullList(apsatusList)){
							this.devplset.addAPStatusList(apsatusList);
						}
						if(SetUtil.isnotNullList(devsatusList)){
							this.devplset.addDevStatusList(devsatusList);
						}
					}
		   }
		} catch (Exception e) {
			System.err.println("dev状态数据解析异常："+data);
		}
		return resMap;
	}  


	@RequestMapping(value = "/findLastNDataByApid", method = RequestMethod.GET)
	@ResponseBody
	public Object findLastNDataByApid(String apid, String deviceid, String key, int n) {
		Date startTime=null;if(n==1){startTime=TimeUtil.getBeforeMinute(5);}else{startTime=TimeUtil.getBeforeHOUR(2);}
		return storageDataCollectionDao.findLastNPoint(apid, deviceid, key, n,startTime);
	}

	@RequestMapping(value = "/findByTime", method = RequestMethod.GET)
	@ResponseBody
	public Object findByTime(String apid, String deviceid, String key,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
			@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {

		return storageDataCollectionDao.findByTime(apid, deviceid, key, startTime, endTime ,"DESC");
	}
	


}
