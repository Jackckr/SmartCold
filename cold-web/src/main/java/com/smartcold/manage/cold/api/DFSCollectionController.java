package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.dao.newdb.DFSDataCollectionMapper;
import com.smartcold.manage.cold.dao.olddb.CongfigMapper;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.entity.newdb.DFSDataCollectionEntity;
import com.smartcold.manage.cold.enums.SetTables;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;

/**
 * (DANFOSS)丹弗斯DEV数据接口
 * cache
 * @author maqiang34
 *
 */
@Controller
public class DFSCollectionController extends BaseController {
	
	private static Gson gson = new Gson();
	
	@Autowired
	private CongfigMapper congfigMapper;
	
	@Autowired
	private DFSDataCollectionMapper dataservice;
	
	public static String dfsdata=null;
	
	public static  HashMap<String,HashMap<String,DFSDataCollectionEntity>> configchcateHashMap=new HashMap<String,HashMap<String,DFSDataCollectionEntity>>();
	
	
	/**
	 *http DEV数据上传接口
	 * @param data
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/dfsDataCollection", method = RequestMethod.POST)
	@ResponseBody
	public Object storageDataCollection(@RequestBody String data) {
        try {
			if(StringUtil.isNull(data)){ return new DataResultDto(500);};
			DFSCollectionController.dfsdata=data;
			Map<String, Object> dataCollectionBatchEntity =DFSCollectionController.gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			String rdcid = dataCollectionBatchEntity.get("rdcId").toString();
            if(!DFSCollectionController.configchcateHashMap.containsKey(rdcid)){this.getConfig(rdcid);}
			HashMap<String, DFSDataCollectionEntity> config = configchcateHashMap.get(rdcid);
		    if(config==null){return new DataResultDto(200);}
		    String table =null;
		    ArrayList<DFSDataCollectionEntity> dataList = null;
		    HashMap<String, ArrayList<DFSDataCollectionEntity>> tempMap=new HashMap<String, ArrayList<DFSDataCollectionEntity>>();
		    for (Map<String, String> info :  ((List<Map<String, String>>) dataCollectionBatchEntity.get("infos"))) {
				DFSDataCollectionEntity newdata = config.get(info.get("tagname"));
				if(newdata!=null){
					 newdata.setValue(info.get("currentvalue"));//更新数据
					 newdata.setTime( info.get("lasttime"));
					 table = newdata.getTable();
					if(tempMap.containsKey(table)){
						tempMap.get(table).add(newdata);
					}else{
						 dataList = new ArrayList<DFSDataCollectionEntity>();
						 dataList.add(newdata);
						 tempMap.put(table, dataList);
					}
				}
			}
			if(SetUtil.isNotNullMap(tempMap)){
				for (String key : tempMap.keySet()) {
					ArrayList<DFSDataCollectionEntity> dataList1 = tempMap.get(key);
					this.dataservice.adddataList(key, dataList1);
				}
			}
			return new DataResultDto(200);
		} catch (Exception e) {
			System.err.println("丹弗斯数据解析异常："+data+"\r\n"+e.getMessage());
			return new DataResultDto(500);
		}
	} 
	
	/**
	 * 获得冷库所以键值对信息
	 * @param table
	 * @param rdcId
	 * @return
	 */
	private List<HashMap<String, Object>> getCofingMapping(String table,String rdcId){
		switch (table) {
		case "blowerset":
			return this.congfigMapper.getBlowerMappingByRdcId(rdcId);
		case "windscreenset":
			return this.congfigMapper.getWindscMappingByRdcId(rdcId);
		case "compressorset":
			return this.congfigMapper.getCompreMappingByRdcId(rdcId);
		case "evaporativewaterset":
			return this.congfigMapper.getEvaporativeMappingByRdcId(rdcId);
		case "evaporativeblowerset":
			return this.congfigMapper.getEvaporativeMappingByRdcId(rdcId);
		default:
			return this.congfigMapper.getObjMappingByRdcId(table, rdcId);
		}
	}
	
	/**
	 * 初始化Mapp配置
	 * @param rdcId
	 */
	private  void getConfig(String rdcId){
		int index=0;List<HashMap<String, Object>> configList=null;
		HashMap<String,DFSDataCollectionEntity > tempMap=new HashMap<String,DFSDataCollectionEntity>();
		for (SetTables item : SetTables.values()) {
			configList=getCofingMapping(item.getTable(), rdcId);
			if(SetUtil.isnotNullList(configList)){
				for (HashMap<String, Object> hashMap : configList) {
					int oid = Integer.parseInt(hashMap.get("id")+"");
					String mapper = hashMap.get("mapping")+"";
					Map<String, String> info = DFSCollectionController.gson.fromJson(mapper, new TypeToken<Map<String, String>>() {}.getType());
					for (Entry<String, String> keyMap : info.entrySet()) {
						tempMap.put(keyMap.getValue(), new DFSDataCollectionEntity(oid,item.getTable().replace("set", ""),keyMap.getKey()));
						++index;
					}
				}
			}
		}
		if(index>0){
			DFSCollectionController.configchcateHashMap.put(rdcId, tempMap);
		}else{
			DFSCollectionController.configchcateHashMap.put(rdcId, null);
		}
	}
	
	
	
}
