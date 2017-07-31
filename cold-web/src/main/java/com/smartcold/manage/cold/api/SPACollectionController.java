package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * SPA(嘉兴)数据协议接口
 * @author Administrator
 *
 */
@Controller
public class SPACollectionController extends BaseController {

	
	private static Gson gson = new Gson();
	private static List<String> cahceList=new ArrayList<String>();

	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/SPADataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object SPADataCollection(@RequestBody String data, HttpServletResponse response) {
		try {
			Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			if(cahceList.size()>100){for (int i = 0; i < 50; i++) {
				cahceList.remove(i);
			} }
			cahceList.add(data);
			System.err.println("收到SPA数据："+data);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("系统在："+TimeUtil.getDateTime()+"检测到SPA数据解析异常：\r\n"+data);
			return new DataResultDto(500);
		}
		return new DataResultDto(200);
	} 
	
	@RequestMapping(value = "/getSPAData", method = RequestMethod.POST)
	@ResponseBody
	public Object SPADataCollection() {
		return cahceList;
	} 
	
	
	private static void test2(){
		  Gson gson = new Gson();
		String data="{'apID': 'AP10','time':'1707310925', 'infos': [{'devID': '69', 'Temp': '00.00'}]}";
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
				System.err.println(arrayList);
			}
		}
	}
	
	public static void main(String[] args) {
	  String data="{'apID':'200154545','time':'1490583510','infos':[{'tagname':'acl1','value':'-18.5'},{'tagname':'acl2','value':'-13.5'}]}";
//	  data=data.replaceAll("'", "\"");
	  Map<String, Object> dataCollectionBatchEntity = gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
	  System.err.println("ok");

	}
	
}
