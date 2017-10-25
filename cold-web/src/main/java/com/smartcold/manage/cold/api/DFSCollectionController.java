package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
import com.smartcold.manage.cold.dao.newdb.DFSDataCollectionMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.dto.DataResultDto;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.WarningsInfo;
import com.smartcold.manage.cold.entity.olddb.ConversionEntity;
import com.smartcold.manage.cold.service.RdcConfService;
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
	private RdcConfService rdcConfService;
	
	@Autowired
	private WarningsInfoMapper warningsInfoMapper;
	
	@Autowired
	private DFSDataCollectionMapper dataservice;
	
	public static String dfsdata=null;
	public static  HashMap<String,HashMap<String, ConversionEntity>> unitConversMap=new HashMap<String,HashMap<String, ConversionEntity>>();
	public static  HashMap<String,HashMap<String,ItemValue>> configchcateHashMap=new HashMap<String,HashMap<String,ItemValue>>();
	
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
			if(StringUtil.isNull(data)){ return DataResultDto.newFailure();};
			DFSCollectionController.dfsdata=data;
			Date date = new Date();
			Map<String, Object> dataCollectionBatchEntity =DFSCollectionController.gson.fromJson(data, new TypeToken<Map<String, Object>>() {}.getType());
			String rdcid = dataCollectionBatchEntity.get("rdcId").toString();
            if(!DFSCollectionController.configchcateHashMap.containsKey(rdcid)){this.rdcConfService.getConfigByRdcId(rdcid); this.rdcConfService.getConverByrdcId(rdcid); }
			HashMap<String, ItemValue> config = configchcateHashMap.get(rdcid);
			HashMap<String, ConversionEntity> unitConvers = unitConversMap.get(rdcid);
		    if(config==null){return  DataResultDto.newSuccess();}
		    ArrayList<ItemValue> dataList = null;
		    String table =null;  ItemValue newdata=null;
		    ArrayList<WarningsInfo> wardataList = new ArrayList<WarningsInfo>();
		    HashMap<String, ArrayList<ItemValue>> tempMap=new HashMap<String, ArrayList<ItemValue>>();
		    for (Map<String, String> info :  ((List<Map<String, String>>) dataCollectionBatchEntity.get("infos"))) {
		    	String name = info.get("tagname");
		    	//当前是告警信息
		    	if(name.indexOf("警")>-1){if("1".equals(info.get("currentvalue"))){wardataList.add(new WarningsInfo(name,Integer.parseInt(rdcid),1,date));}continue;}
		    	newdata = config.get(name);if(newdata==null){ continue;}
		    	if(unitConvers!=null&&unitConvers.containsKey(name)){//unitConvers 数据转换集合->电压  ，压力转换
				     if(! counsValue(unitConvers, newdata, info, name)){ continue;}//  加入转换对象
		    	}else{
		    		 newdata.setValue(info.get("currentvalue"));
					 newdata.setTime( info.get("lasttime"));
		    	}
				 table = newdata.getTable();
				 if(StringUtil.isnotNull(table)){
					 if(tempMap.containsKey(table)){
							tempMap.get(table).add(newdata);
						}else{
							 dataList = new ArrayList<ItemValue>();
							 dataList.add(newdata);
							 tempMap.put(table, dataList);
						}
						if("isRunning,isDefrosting".indexOf(newdata.getKey())>-1){
							ItemValue clone  = (ItemValue) newdata.clone();
							if(clone!=null){
								if("isRunning".equals(newdata.getKey())){
									clone.setKey("isDefrosting");clone.setValue(0);
								}else{
									clone.setKey("isRunning");clone.setValue(0);
								}
								tempMap.get(table).add(clone);
							}
						}
				 }else{
					 System.err.println("未知保存对象"+gson.toJson(newdata));
				 }
			}
			if(SetUtil.isNotNullMap(tempMap)){
				for (String key : tempMap.keySet()) {
					this.dataservice.adddataList(key,  tempMap.get(key));
				}
			}
			if(SetUtil.isnotNullList(wardataList)){
				this.warningsInfoMapper.addwarningsinfos(wardataList);
			}
			return  DataResultDto.newSuccess();
		} catch (Exception e) {
			e.printStackTrace();
			return  DataResultDto.newSuccess();
		}
	}

	/**
	 * 根据配置进行转换
	 * @param unitConvers
	 * @param newdata
	 * @param info
	 * @param name
	 */
	 private  boolean counsValue(HashMap<String, ConversionEntity> unitConvers,ItemValue newdata, Map<String, String> info,String name) {
		String val=null;String[] key_val =null;ConversionEntity conversionEntity=null;
			 val = info.get("currentvalue");
		    		 try {
						conversionEntity= unitConvers.get(name);
						switch (conversionEntity.getType()) {
						case 1://换算
							val= (Double.parseDouble(val)*Double.parseDouble(conversionEntity.getMapping()))+"";
							newdata.setValue(val);
							return true;
						case 2://switch
							 key_val = conversionEntity.getUnit().get(val);
							 if(key_val!=null){
								    newdata.setKey(key_val[0]);
									newdata.setValue(key_val[1]);
									return true;
							 }else{
								 System.err.println("进入风机转换1：转换异常"+val);
								 return false;
							 }
						case 3://指向
							ConversionEntity conversionEntity2 = unitConvers.get(conversionEntity.getMapping());//映射解析对象  减少内存
							key_val = conversionEntity2.getUnit().get(val);
							if(key_val!=null){
								newdata.setKey(key_val[0]);
								newdata.setValue(key_val[1]);
								return true;
							}else{
								 System.err.println("进入风机转换2：转换异常"+val);
								 return false;
							}
						default:
							return false;
						}
					} catch (Exception e) {
						e.printStackTrace();
						System.err.println("转换出错！");
						return false;
					}
	} 
	

	

	

}
