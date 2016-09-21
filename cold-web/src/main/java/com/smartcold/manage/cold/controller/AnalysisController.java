package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.smartcold.manage.cold.dao.olddb.BlowerMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.olddb.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dao.olddb.PowerSetMapping;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.service.CompressorGroupService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;
/**
 * 分析Controller
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/AnalysisController")
public class AnalysisController {
	@Autowired
	private PowerSetMapping powerSetDao;
	
	@Autowired
	private BlowerMapper blowerMapper;
	
	@Autowired
	private CompressorGroupService compressorGroupService;
	
	@Autowired
	private CompressorGroupSetMapper compressorGroupSetDao;
	
	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetDao;
	
	@Autowired
	private ColdStorageAnalysisService  coldStorageAnalysisService;
	/**
	 * 获得有效冷库门
	 * @param recId
	 * @return
	 */
	@RequestMapping(value = "/getColdStorageDoor")
	@ResponseBody
	public Object getColdStorageDoor(Integer rdcId){
		return coldStorageDoorSetDao.findValidByRdcId(rdcId);
	}
	
	/**
	 * 获得风机
	 * @param recId
	 * @return
	 */
	@RequestMapping(value = "/getColdStorageBlower")
	@ResponseBody
	public Object getColdStorageBlower(Integer rdcId){
        return  blowerMapper.findBlowerByRdcID(rdcId);
	}
	
	/**
	 * 
	 * @param rdcId:冷库ID
	 * @param compressorsId :压缩机组id
	 * @return
	 */
	@RequestMapping(value = "/getCoolingAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getCoolingAnalysis(Integer rdcId,Integer[] compressorsId) {
		try {
			if(rdcId==null){return ResponseData.newFailure("非法请求！");}
			List<CompressorGroupSetEntity> compressList = this.compressorGroupSetDao.findByRdcId(rdcId);
			if(SetUtil.isnotNullList(compressList)){
				HashMap<String, Object> chardata=new HashMap<String, Object>();//
				//==========================================虚拟数据start-30天==========================================
				String xdata[] =new String[30];//日期
				SimpleDateFormat   sdf   =   new   SimpleDateFormat( "yyyy-MM-dd"); 
				for (int i = 0; i<30; i++) {
					Calendar c  = Calendar.getInstance();
					c.add(Calendar.DAY_OF_MONTH,-30+i);
					xdata[i]=sdf.format(c.getTime());
					}
				    chardata.put("xdata", xdata);//展示数据
				List<Object> templist=new ArrayList<Object>();
				DecimalFormat    dfformat   = new DecimalFormat("######0.00");   
				for (CompressorGroupSetEntity comss : compressList) {
					double y1[]=new double[xdata.length];
					for (int i = 0; i<xdata.length; i++) {
						y1[i]=Double.parseDouble(dfformat.format(Math.random()));
					}
					HashMap<String, Object> charxdata=new HashMap<String, Object>();//
					charxdata.put("name", comss.getName());
					charxdata.put("id", comss.getId());
					charxdata.put("data", y1);
					templist.add(charxdata);
				}
				chardata.put("chdata", templist);
				//==========================================虚拟数据end==========================================
				return ResponseData.newSuccess(chardata);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure();
		}
		return ResponseData.newFailure("没有数据！");
	}


	
	/**
	 * 支持多key
	 * @param index:当前功能模块 ->0  单key  1 :多key
	 * @param rdcId:冷库id ->暂时无用
	 * @param type:数据类型->StorageType->type
	 * @param confdata:采集数据父项
	 * @param key:采集数据
	 * @param startTime:开始时间
	 * @param endTime:结束数据
	 * @return
	 */
	@RequestMapping(value = "/getCasesTotalSISAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> getCasesTotalSISAnalysis(int index,Integer rdcId,Integer type,String confdata, String key, String startTime,String endTime) {
		try {
			if(StringUtil.isNull(confdata)||StringUtil.isNull(key)){return ResponseData.newFailure("非法请求！");}
			String [] keys={};String [] keyts={};String [] titls={};
			HashMap<Integer, Integer> oidsymap=new HashMap<Integer, Integer>();
			HashMap<String, Integer> keymap=new HashMap<String, Integer>();
			if(index==1){
				keys=StringUtil.splitString(key);
				if(keys.length!=2){return ResponseData.newFailure("非法请求！key参数不完整");}
				 keyts=StringUtil.splitfhString(keys[0]);//主key
				 titls=StringUtil.splitfhString(keys[1]);//主key
				if(keyts.length!=titls.length){return ResponseData.newFailure("非法请求！key参数不完整");}
				for (int i = 0; i < keyts.length; i++) {keymap.put(keyts[i].replace("'", ""), i);}
			 }
			List<PowerSetEntity> powerList  = JSON.parseArray(confdata, PowerSetEntity.class);
			if(SetUtil.isNullList(powerList)){return ResponseData.newFailure("非法请求！");}
			String oid="";int[] oids=new int[powerList.size()];
			for (PowerSetEntity powst : powerList) {
				 oids[powst.getId()]=powst.getRdcid();
				 if(!oid.equals("")){oid+=","+ powst.getRdcid();}else{oid=powst.getRdcid()+"";}
				 oidsymap.put( powst.getRdcid(),powst.getId());
			}
			HashMap<String, Object> fileter=new HashMap<String, Object>();
			fileter.put("type", type);
			fileter.put("oid", oid);
			fileter.put("key", index==0?key:keys[0]);
			fileter.put("desc", "asc");
			List<ColdStorageAnalysisEntity> datalist= this.coldStorageAnalysisService.findValueByFilter(fileter);
			HashMap<String, Object> restMap=new HashMap<String, Object>();
			if(SetUtil.isnotNullList(datalist)){
				Object[] objects ={};
				LinkedHashMap<String, Object[]> tempData=new LinkedHashMap<String, Object[]>();
				for (ColdStorageAnalysisEntity coldStorageAnalysisEntity : datalist) {
					String data=TimeUtil.getFormatDate( coldStorageAnalysisEntity.getDate());
					int oidindex= oidsymap.get(coldStorageAnalysisEntity.getOid());
					int keyindex=index==0?0:keymap.get(coldStorageAnalysisEntity.getKey());
					if(tempData.containsKey(data)){
						 objects = tempData.get(data);
					}else{
						 objects =new Object[index==0? oids.length:  oids.length*keyts.length];
					}
					objects[index==0? oidindex:  oidindex*keyts.length+keyindex]=coldStorageAnalysisEntity.getValue();//计算偏移量
					tempData.put(data, objects);
				}
				restMap.put("tbdata", tempData);
			}
			restMap.put("titls", titls);
			restMap.put("keyts", keyts);
			return ResponseData.newSuccess(restMap);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("查询失败！请稍后重试！");
		}
	}
	


}
