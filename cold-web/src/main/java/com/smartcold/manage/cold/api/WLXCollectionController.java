package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
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
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 上海座头鲸接口
 * @author Administrator
 *
 */
@Controller
public class WLXCollectionController extends BaseController {

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
	@RequestMapping(value = "/wlxDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object wlxDataCollection(@RequestBody String data, HttpServletResponse response) {
		try {
			if(StringUtil.isNull(data)){new DataResultDto(500);}
			System.err.println("收到座头鲸数据："+data);
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
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到座头鲸DEV数据解析异常：\r\n"+data);
			return new DataResultDto(500);
		}
		return new DataResultDto(200);
	} 
	
//	public static void main(String[] args) {
//      String data="{\"apID\":\"0000000080908090\",\"infos\":[{\"devID\":\"1000000080908090\",\"Temp\":\"22.0\",\"time\":\"1498116189\"}{\"devID\":\"2000000080908090\",\"Temp\":\"14.0\",\"time\":\"1498116189\"}]}";
//      Gson gson = new Gson();
//      Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
//		if(dataCollectionBatchEntity.containsKey("infos")){
//			String apID = dataCollectionBatchEntity.get("apID").toString();
//			ArrayList<StorageDataCollectionEntity> arrayList = new ArrayList<StorageDataCollectionEntity>();
//			for (Map<String, String> info : (List<Map<String, String>>) dataCollectionBatchEntity.get("infos")) {
//				Date time = new Date(Long.parseLong(info.remove("time")) * 1000);
//				String deviceId = info.remove("devID").toString();
//				for (Entry<String, String> item : info.entrySet()) {
//					arrayList.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
//				}
//			}
//			System.err.println("sdf");
//		}
//	}
	

}
