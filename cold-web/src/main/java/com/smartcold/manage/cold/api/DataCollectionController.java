package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.smartcold.manage.cold.util.CacheManager;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 北京中威DEV数据接口 第二代
 * @author Administrator
 *
 */
@Controller
public class DataCollectionController extends BaseController {

	private static Gson gson = new Gson();
	
	@Autowired
	public   DevStatusMapper devplset;
	
	@Autowired
	private StorageDataCollectionMapper storageDataCollectionDao;
	

	

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
			if(StringUtil.isNull(data)){return DataResultDto.newFailure();}
			CacheManager.addZWTempData(data);
			Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			if(dataCollectionBatchEntity.containsKey("infos")){
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
			}
		} catch (Exception e) {
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到北京中威DEV数据解析异常：\r\n"+data);
			return DataResultDto.newFailure();
		}
		return  DataResultDto.newSuccess();
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
		resMap.put("status","200");resMap.put("time", TimeUtil.getMillTime());
		try {
			if(StringUtil.isnotNull(data)){
			    	ArrayList<StorageDataCollectionEntity> apsatusList = new ArrayList<StorageDataCollectionEntity>();
			    	ArrayList<StorageDataCollectionEntity> devsatusList = new ArrayList<StorageDataCollectionEntity>();
					Map<String, Object> dataMap = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
					String apID = dataMap.get("apID").toString();
					apsatusList.add(new StorageDataCollectionEntity(apID, null,"MSI", dataMap.get("MSI").toString(), new Date(Long.parseLong(dataMap.remove("time").toString()) * 1000)));
//					if(dataMap.containsKey("LAC")){apsatusList.add(new StorageDataCollectionEntity(apID, null,"LAC", dataMap.get("LAC").toString(), aptime));}
//					if(dataMap.containsKey("CID")){apsatusList.add(new StorageDataCollectionEntity(apID, null,"CID", dataMap.get("CID").toString(), aptime));}
					if(dataMap.containsKey("infos")){//数据状态包
						List<Map<String, String>> devinfos = (List<Map<String, String>>) dataMap.get("infos");
						for (Map<String, String> info : devinfos) {
							Date time = new Date(Long.parseLong(info.remove("time")) * 1000);
							String deviceId = info.remove("devID").toString();
							for (Entry<String, String> item : info.entrySet()) {
								devsatusList.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
							}
						}
					}
					if(SetUtil.isnotNullList(apsatusList)){
						this.devplset.addAPStatusList(apsatusList);
					}
					if(SetUtil.isnotNullList(devsatusList)){
						this.devplset.addDevStatusList(devsatusList);
					}
		   }
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("dev状态数据解析异常："+data);
		}
		return resMap;
	}  

}
