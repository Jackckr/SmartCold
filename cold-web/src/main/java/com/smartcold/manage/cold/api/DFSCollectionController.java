package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
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
	
	private static  HashMap<String,HashMap<String,DFSDataCollectionEntity>> configchcateHashMap=new HashMap<String,HashMap<String,DFSDataCollectionEntity>>();
	
	
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
			System.err.println("丹弗斯："+data);
			if(StringUtil.isNull(data)){ return new DataResultDto(500);};
			Map<String, Object> dataCollectionBatchEntity =DFSCollectionController.gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			String rdcid = dataCollectionBatchEntity.get("rdcId").toString();
            if(!DFSCollectionController.configchcateHashMap.containsKey(rdcid)){this.getConfig(rdcid);}
			HashMap<String, DFSDataCollectionEntity> config = configchcateHashMap.get(rdcid);
		    if(config==null){return new DataResultDto(200);}
		    ArrayList<DFSDataCollectionEntity> dataList = new ArrayList<DFSDataCollectionEntity>();
		    for (Map<String, String> info :  ((List<Map<String, String>>) dataCollectionBatchEntity.get("infos"))) {
				DFSDataCollectionEntity newdata = config.get(info.get("tagname"));
				if(newdata!=null){
					newdata.setValue(info.get("currentvalue"));//更新数据
					newdata.setTime(info.get("lasttime"));
					dataList.add(newdata);
				}
			}
			if(SetUtil.isnotNullList(dataList)){
				for (DFSDataCollectionEntity item : dataList) {
					this.dataservice.batchInsert(item);
				}
			}
			return new DataResultDto(200);
		} catch (JsonSyntaxException e) {
			e.printStackTrace();
			return new DataResultDto(500);
		}
	} 
	
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
