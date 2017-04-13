package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
			storageDataCollectionDao.batchInsert(arrayList);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("DEV数据解析出错。。。。。。。。。。。。");
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
					Map<String, Object> dataMap = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
					String apID = dataMap.get("apID").toString();
					if(dataMap.containsKey("infos")){//数据状态包
						Date aptime =new Date(Long.parseLong(dataMap.remove("time").toString()) * 1000);
						ArrayList<StorageDataCollectionEntity> apsatusList = new ArrayList<StorageDataCollectionEntity>();
						ArrayList<StorageDataCollectionEntity> devsatusList = new ArrayList<StorageDataCollectionEntity>();
						apsatusList.add(new StorageDataCollectionEntity(apID, null,"MSI", dataMap.get("MSI").toString(), aptime));
						if(dataMap.containsKey("LAC")){apsatusList.add(new StorageDataCollectionEntity(apID, null,"LAC", dataMap.get("LAC").toString(), aptime));}
						if(dataMap.containsKey("CID")){apsatusList.add(new StorageDataCollectionEntity(apID, null,"CID", dataMap.get("CID").toString(), aptime));}
						List<Map<String, String>> devinfos = (List<Map<String, String>>) dataMap.get("infos");
						for (Map<String, String> info : devinfos) {
							Date time = new Date(Long.parseLong(info.remove("time")) * 1000);
							String deviceId = info.remove("devID").toString();
							for (Entry<String, String> item : info.entrySet()) {
								devsatusList.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
							}
						}
						this.devplset.addAPStatusList(apsatusList);
						this.devplset.addDevStatusList(devsatusList);
					}else{//校时包
						Integer appl = this.devplset.getApplByApID(apID);
						 List<HashMap<String, String>> devPLbyApID = this.devplset.getDevPLbyApID(apID);
						if(appl!=null){resMap.put("APL", appl+"") ; }//
						if(SetUtil.isnotNullList(devPLbyApID)){resMap.put("infos", devPLbyApID) ;}//返回dev采集频率信息
				   }
		   }
		} catch (Exception e) {
			e.printStackTrace();
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
