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
import com.smartcold.manage.cold.entity.olddb.ConversionEntity;
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
	public static  HashMap<String,HashMap<String, ConversionEntity>> unitConversMap=new HashMap<String,HashMap<String, ConversionEntity>>();
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
            if(!DFSCollectionController.configchcateHashMap.containsKey(rdcid)){this.getConfig(rdcid); this.getConver(rdcid); }
			HashMap<String, DFSDataCollectionEntity> config = configchcateHashMap.get(rdcid);
			HashMap<String, ConversionEntity> unitConvers = unitConversMap.get(rdcid);
		    if(config==null){return new DataResultDto(200);}
		    ArrayList<DFSDataCollectionEntity> dataList = null;String val =null;
		    String table =null;  String[] key_val =null;DFSDataCollectionEntity newdata=null;ConversionEntity conversionEntity=null;
		    HashMap<String, ArrayList<DFSDataCollectionEntity>> tempMap=new HashMap<String, ArrayList<DFSDataCollectionEntity>>();
		    for (Map<String, String> info :  ((List<Map<String, String>>) dataCollectionBatchEntity.get("infos"))) {
		    	String name = info.get("tagname");
		    	  newdata = config.get(name);
		    	if(newdata==null){continue;}
		    	 val = info.get("currentvalue");
				    if(unitConvers.containsKey(name)){
					    		 conversionEntity= unitConvers.get(name);
					    		switch (conversionEntity.getType()) {
								case 1://换算
									info.put("currentvalue", (Integer.parseInt(val)*Double.parseDouble(conversionEntity.getMapping()))+"");
									break;
								case 2://switch
									 key_val = conversionEntity.getUnit().get(val);
									newdata.setKey(key_val[0]);
									newdata.setValue(key_val[1]);
									break;
				                case 3://指向
				                	ConversionEntity conversionEntity2 = unitConvers.get(conversionEntity.getMapping());//映射解析对象  减少内存
				                	key_val = conversionEntity2.getUnit().get(val);
				                    newdata = new DFSDataCollectionEntity();
									newdata.setKey(key_val[0]);
									newdata.setValue(key_val[1]);
									break;	
								default:
									break;
								}
					  }
					 newdata.setValue(val);//更新数据
					 newdata.setTime( info.get("lasttime"));
					 table = newdata.getTable();
					if(tempMap.containsKey(table)){
						tempMap.get(table).add(newdata);
					}else{
						 dataList = new ArrayList<DFSDataCollectionEntity>();
						 dataList.add(newdata);
						 tempMap.put(table, dataList);
					}
					if("isRunning,isDefrosting".indexOf(newdata.getKey())>-1){
						DFSDataCollectionEntity clone  = (DFSDataCollectionEntity) newdata.clone();
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
	
	
	
	private void getConver(String rdcId){
		HashMap<String , ConversionEntity> unithMap=new HashMap<String , ConversionEntity>();
		List<ConversionEntity> conversList = this.congfigMapper.getOHMappingByRdcId(rdcId);
		if(SetUtil.isnotNullList(conversList)){
			   for (ConversionEntity conversionEntity : conversList) {
			    	if(2==conversionEntity.getType()){
			    		HashMap<String, String[]> temp=new HashMap<String, String[]>();
			    		Map<String, String> dataCollectionBatchEntity =DFSCollectionController.gson.fromJson(conversionEntity.getMapping(), new TypeToken<Map<String, String>>() {}.getType());
						    for (String key : dataCollectionBatchEntity.keySet()) {
						    	temp.put(key, dataCollectionBatchEntity.get(key).split("-"));
							}
						    conversionEntity.setUnit(temp);
						    unithMap.put(conversionEntity.getName(), conversionEntity);
			    	}else{
			    		unithMap.put(conversionEntity.getName(), conversionEntity);
			    	}
			    	
				}
			    unitConversMap.put(rdcId, unithMap);
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
						tempMap.put( keyMap.getValue(), new DFSDataCollectionEntity(oid,item.getTable().replace("set", ""),keyMap.getKey()));
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
