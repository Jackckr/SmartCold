package com.smartcold.manage.cold.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.smartcold.manage.cold.dao.olddb.CongfigMapper;
import com.smartcold.manage.cold.entity.comm.ItemConf;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.olddb.ConversionEntity;
import com.smartcold.manage.cold.enums.SetTables;
import com.smartcold.manage.cold.service.RdcConfService;
import com.smartcold.manage.cold.service.redis.CacheService;
import com.smartcold.manage.cold.util.SetUtil;

/**
 * 
 * @author Administrator
 *
 */
@Service
@CacheConfig(cacheNames = "rdcConfService")
public class RdcConfServiceImpl implements RdcConfService {
	@Autowired
	private CacheService cacheService;
	@Autowired
	private CongfigMapper congfigMapper;
	private static Gson gson = new Gson();
	
	
	
	
	@Override
	public ItemConf findRdcConfByDevId(String apID){
		String key="dev:dev_rdcconf:"+apID;
		ItemConf item	= this.cacheService.getData(key);
		if(item!=null){
		   	return item.getId()==-1?null:item;
		}else{
			item = congfigMapper.findRdcConfByDevId(apID);
			if(item==null){item=new ItemConf();item.setId(-1);  }; 
			this.cacheService.putData(key, item);
			return item;
		}
	}

	private HashMap<String , ConversionEntity> getConver(String rdcId) {
			HashMap<String , ConversionEntity> unithMap=new HashMap<String , ConversionEntity>();
			List<ConversionEntity> conversList = this.congfigMapper.getOHMappingByRdcId(0,rdcId);
			if(SetUtil.isnotNullList(conversList)){
				   for (ConversionEntity conversionEntity : conversList) {
				    	if(2==conversionEntity.getType()){
				    		HashMap<String, String[]> temp=new HashMap<String, String[]>();
				    		Map<String, String> dataCollectionBatchEntity =gson.fromJson(conversionEntity.getMapping(), new TypeToken<Map<String, String>>() {}.getType());
						    for (String key : dataCollectionBatchEntity.keySet()) {temp.put(key, dataCollectionBatchEntity.get(key).split("-"));}  conversionEntity.setUnit(temp);unithMap.put(conversionEntity.getName(), conversionEntity);
				    	}else{
				    		unithMap.put(conversionEntity.getName(), conversionEntity);
				    	}
					}
				   return unithMap;
			}
			return null;
	}

	private HashMap<String,ItemValue > getConfig(String rdcId) {
		int index=0;List<HashMap<String, Object>> configList=null;
		HashMap<String,ItemValue > tempMap=new HashMap<String,ItemValue>();
		for (SetTables item : SetTables.values()) {
			configList=getCofingMapping(item.getTable(), rdcId);
			if(SetUtil.isnotNullList(configList)){
				for (HashMap<String, Object> hashMap : configList) {
					int oid = Integer.parseInt(hashMap.get("id")+"");
					String mapper = hashMap.get("mapping")+"";
					Map<String, String> info = gson.fromJson(mapper, new TypeToken<Map<String, String>>() {}.getType());
					for (Entry<String, String> keyMap : info.entrySet()) {
						tempMap.put( keyMap.getValue(), new ItemValue(oid,item.getTable().replace("set", ""),keyMap.getKey()));
						++index;
					}
				}
			}
		}
		if(index>0){
			return tempMap;
		}else{
			return null;
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
			return this.congfigMapper.getEvaporativewatersetByRdcId(rdcId);
		case "evaporativeblowerset":
			return this.congfigMapper.getEvaporativeblowersetByRdcId(rdcId);
		default:
			return this.congfigMapper.getObjMappingByRdcId(table, rdcId);
		}
	}
	
	
	/**
	 * 初始化类型转换配置
	 * @param rdcId
	 */
	public HashMap<String, ConversionEntity> getConverByrdcId(String rdcId){
		try {
			long starttime = System.currentTimeMillis();
			HashMap<String, ConversionEntity> conver=this.cacheService.getData("rdc:rdc_cou:"+rdcId);
			starttime=System.currentTimeMillis()-starttime;
			System.err.println("用时："+starttime);
			if(conver!=null){
				return conver.size()>0? conver:null;
			}
			conver =this.getConver(rdcId) ;
			if(conver!=null){
				 this.cacheService.putData("rdc:rdc_cou:"+rdcId, conver);//缓存数据 -----防止需要
			}else{
				this.cacheService.putData("rdc:rdc_cou:"+rdcId, new HashMap<String, ConversionEntity>());//防止反复读取 注意缓存雪崩
			}
			return conver;
		} catch (JsonSyntaxException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	
	/**
	 * 初始化Mapp配置
	 * @param rdcId
	 */
	public HashMap<String, ItemValue> getConfigByRdcId(String rdcId){
		try {
			String key="rdc:rdc_cof:"+rdcId;
			long starttime = System.currentTimeMillis();
			HashMap<String, ItemValue> config =this.cacheService.getData(key);
			starttime=System.currentTimeMillis()-starttime;
			System.err.println("用时："+starttime);
			if(config!=null){
				return config.size()>0? config:null;
			}else{
				config = this.getConfig(rdcId);
				if(config!=null){
					 this.cacheService.putData(key, config);//缓存数据 -----防止需要
				}else{
					 this.cacheService.putData(key, new HashMap<String, ItemValue>() );//防止反复读取 注意缓存雪崩
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
		
		
		
		
	}
	
}
