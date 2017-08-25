package com.smartcold.manage.cold.api;

import java.util.ArrayList;
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

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dao.newdb.DevStatusMapper;
import com.smartcold.manage.cold.dao.newdb.StorageDataCollectionMapper;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
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

	public static Boolean isUpdat=false;
			
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/QTisUpdat")
	@ResponseBody
	public void QTisUpdat() {
		QTCollectionController.isUpdat=!QTCollectionController.isUpdat;
	} 		
			
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/QTDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object QTDataCollection(@RequestBody String data) {
		try {
			System.out.println(data);
			if(StringUtil.isNull(data)){return DataResultDto.newFailure();}
			Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			if(dataCollectionBatchEntity.containsKey("infos")){
				String apID = dataCollectionBatchEntity.get("apID").toString();
				System.err.println(apID);
				ArrayList<StorageDataCollectionEntity> arrayList = new ArrayList<StorageDataCollectionEntity>();
				for (Map<String, String> info : (List<Map<String, String>>) dataCollectionBatchEntity.get("infos")) {
					System.err.println(info);
//					Date time = new Date(Long.parseLong(info.remove("time")) * 1000);
//					String deviceId = info.remove("devID").toString();
//					for (Entry<String, String> item : info.entrySet()) {
//						arrayList.add(new StorageDataCollectionEntity(apID, deviceId, item.getKey(), item.getValue(), time));
//					}
				}
				
			}
		   return DataResultDto.newSuccess(isUpdat);//更新数据服务
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
	public Object QTDEVConfig( String apID) {
		try {
			if(StringUtil.isNull(apID)){return DataResultDto.newFailure();}
			LinkedHashMap<String, Object> resMap=new LinkedHashMap<String, Object>();
			resMap.put("status","200");
			resMap.put("time", TimeUtil.getMillTime());
			if(Math.rint(10)%2==0||Math.rint(10)%3==0){	resMap.put("PL", "30");}
            List<HashMap<String, Object>> infoHashMaps=new ArrayList<HashMap<String, Object>>();
            HashMap<String, Object> dataHashMap=new HashMap<>();
            dataHashMap.put("tagname", "低温库设定温度1");
            dataHashMap.put("value", "-12.5");
            infoHashMaps.add(dataHashMap);
            resMap.put("infos", infoHashMaps);
			return resMap;
		} catch (Exception e) {
			return DataResultDto.newFailure();
		}
	
	}  

}
