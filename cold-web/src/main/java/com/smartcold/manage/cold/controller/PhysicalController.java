package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.WeightSetMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;
import com.smartcold.manage.cold.entity.olddb.WeightSetEntity;
import com.smartcold.manage.cold.enums.SetTables;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 体检
 *  old:2016年9月24日-- 谭总
 *  new：2017年7月27日14:24:42-- 孔院
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/physicalController")
public class PhysicalController {
	@Autowired
	private QuantityMapper quantityMapper;
	@Autowired
	private WeightSetMapper weightSetMapper;
	@Autowired
	private ColdStorageSetMapper coldsetServer;
	@Autowired
	private ColdStorageAnalysisService coldStorageAnalysisService;
	
    private final static 	DecimalFormat df = new DecimalFormat("######0.00");
    
    /**
	 * 获得集团名称 
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/getCompNameByRdcId")
	@ResponseBody
	public ResponseData<String> getCompNameByRdcId(int rdcId) {
		return ResponseData.newSuccess( this.quantityMapper.getCompNameByRdcId(rdcId));
	}
    
    /**
	 * 获得机组运剩余运行时间
	 * 保养提醒模块
	 * @param oids:压缩机组id集合
	 * @return
	 */
    @RequestMapping(value = "/getCompressorinfo")
	@ResponseBody
	public ResponseData<HashMap<Integer, Object>> getCompressorinfo(String oids) {
    	if(StringUtil.isnotNull(oids)){
    		List<CompressorSetEntity> getcoldstoraginfo = this.quantityMapper.getcoldstoraginfo(oids);
    		HashMap<Integer, Object> restMap=new HashMap<Integer, Object>();
    		if(SetUtil.isnotNullList(getcoldstoraginfo) ){
    			for (CompressorSetEntity compressorSetEntity : getcoldstoraginfo) {
    				Double sumr = this.quantityMapper.getSumRunTime(compressorSetEntity.getId(), compressorSetEntity.getLastMaintainTime());
    				if(sumr==null){sumr=new Double(0);}else{
    					sumr=sumr/3600;
    				}
    				restMap.put(compressorSetEntity.getId(), compressorSetEntity.getMaintenancetime()-sumr)	;
				}
    		}
    		return ResponseData.newSuccess(restMap);
    	}
    	return ResponseData.newFailure("非法请求！");
    }
	/**
	 * 根据rdcid体检
	 * 1.检查冷库信息
	 * 2.检查设备信息
	 * 3.开始体检
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/checkup")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> checkup(Integer rdcId) {
		if(rdcId==null){ return ResponseData.newFailure("0");}//0.非法请求
		Date startTime = TimeUtil.getBeforeDay(30),endTime = TimeUtil.getBeforeDay(0);
		String stTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(30))+" 00:00:00";
		String edTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(0))+ " 23:59:59";
		HashMap<String, Object> resMap=new HashMap<String, Object>();
		WeightSetEntity weightSet = this.weightSetMapper.getWeightSet(rdcId);//占比
		if(weightSet==null){weightSet=new WeightSetEntity(0,2,10,10,2,3,0,30,5,1);};
		List<ColdStorageSetEntity> coldStorageSetList =this.coldsetServer.findByRdcId(rdcId);
		if(SetUtil.isnotNullList(coldStorageSetList)){
			double sumtempS = 0; double sumtranS=0; 
			HashMap<Integer, Object> tempScores=new HashMap<Integer, Object>();
			HashMap<Integer, Object> transportScores=new HashMap<Integer, Object>();
			boolean hastemp=false,hastran=false;
			for (ColdStorageSetEntity item : coldStorageSetList) {
			     int[] tempS = this.getTempScores(startTime, endTime, item, weightSet); //当前冷库分数
			 	 int[] tranS = this.getTransportScores(stTime, edTime, item, weightSet);//运管
			 	 sumtempS+=tempS[1];sumtranS+=tranS[1];
			 	 if(!hastemp&&tempS[0]==1){hastemp=true; }
			 	 if(!hastran&&tranS[0]==1){hastran=true; }
			 	 tempScores.put(item.getId(), new Object[]{getColorVal(tempS[1]),Double.parseDouble(df.format( tempS[1]))});//1.获取冷库的分数
				 transportScores.put(item.getId(),new Object[]{getColorVal(tranS[1]),Double.parseDouble(df.format(tranS[1])) });//2.运管分数
			}
			int[] cooling = this.getColdStorageScores(stTime, edTime, rdcId, weightSet);
			resMap.put("hastemp", hastemp);
			resMap.put("hastran", hastran);
			resMap.put("hascool", cooling[0]==1?true:false);
			resMap.put("TempScores",tempScores );
			resMap.put("TransportScores",transportScores );
			resMap.put("avgTempScores",(int)sumtempS/coldStorageSetList.size());
			resMap.put("avgTransportScores",(int)sumtranS/coldStorageSetList.size() );
			resMap.put("cooling", cooling[1]);//制冷分数
		}
		return ResponseData.newSuccess(resMap);
	}
	
	  /**
	  * 根据id对冷库评分
	  * @param key
	  * @param type
	  * @param stTime
	  * @param edTime
	  * @param obj
	  * @param weightSet
	  * //Ct=100-超温因子*20-（Tmax-Tset-Tdiff）*2-保温因子*10-1/温度周期因子（降温部分）*10
	  * @return
	  */
	private int[] getTempScores(Date startTime,Date endTime,ColdStorageSetEntity obj,WeightSetEntity weightSet){
		double L1=0,L2=0,L3=0; int ishasplc=0;
		try {
			  List<String> keylist = Arrays.asList("OverTempL1Count,OverTempL2Count,OverTempL3Count".split(","));
			  Map<String, List<ColdStorageAnalysisEntity>> overTempMap = this.coldStorageAnalysisService.findDVDataByDate(SetTables.STORAGESET.getType(), obj.getId(),keylist , startTime, endTime);
			  //开始计算分数
			  List<ColdStorageAnalysisEntity> anaysislist = overTempMap.get("OverTempL1Count");
			  if(SetUtil.isnotNullList(anaysislist)){
				  ishasplc=1;
				for (ColdStorageAnalysisEntity coldStorageAnalysisEntity : anaysislist) {
					L1+=coldStorageAnalysisEntity.getValue();
				}
			  }
			  anaysislist = overTempMap.get("OverTempL2Count");
			  if(SetUtil.isnotNullList(anaysislist)){
				  ishasplc=1;
				  for (ColdStorageAnalysisEntity coldStorageAnalysisEntity : anaysislist) {
					  L2+=coldStorageAnalysisEntity.getValue();
				  }
			  }
			  anaysislist = overTempMap.get("OverTempL3Count");
			  if(SetUtil.isnotNullList(anaysislist)){
				  ishasplc=1;
				  for (ColdStorageAnalysisEntity coldStorageAnalysisEntity : anaysislist) {  L3+=coldStorageAnalysisEntity.getValue(); }
			  }
			 return new int[]{ishasplc,(int)(100-L1*10- (int)(L2/4)*5- (int)(L3/8*2))};
		} catch (Exception e) {
			e.printStackTrace();
		}
     return new int[]{ishasplc,65};
	}
	/**
	  * 运管分析
	  * @param key
	  * @param type
	  * @param stTime
	  * @param edTime
	  * @param obj
	  * @param weightSet
	  * @return
	  */
	private int[] getTransportScores(String stTime,String edTime,ColdStorageSetEntity obj,WeightSetEntity weightSet){
		double emgodunit=0; int ishasplc=0;
		try {
			Double doorAvgTime	=this.quantityMapper.getSisBayKey(1,obj.getId(), "DoorAvgTime", stTime, edTime);//获得平均开门时间
			if(doorAvgTime!=null&&doorAvgTime>0){doorAvgTime=(doorAvgTime/3600)*weightSet.getTransport1();ishasplc=1;}else{doorAvgTime=new Double(0);}
			List<HashMap<String, Object>> goodQuantit = this.quantityMapper.getGoodQuantit(obj.getId(), stTime, edTime);
			if (SetUtil.isnotNullList(goodQuantit)&&goodQuantit.get(0)!=null) {
				ishasplc=1;
			  Double  temp=	 (Double) goodQuantit.get(0).get("temp");
			  Double quantit=(Double) goodQuantit.get(0).get("quantit");
			  emgodunit= quantit*(temp-obj.getStartTemperature())*weightSet.getTransport2();
			  if(emgodunit<0){emgodunit=0;}
			}
		  return new int[]{ishasplc,(int)Math.abs(100-doorAvgTime-emgodunit)};
		} catch (Exception e) {
			e.printStackTrace();
		}
     return new int[]{1,45};
	}
	
	
	/* 机组分析
	 * @param key
	 * @param type
	 * @param stTime
	 * @param edTime
	 * @param obj
	 * @param weightSet
	 * @return
	 * GoodsHeat
	 */
	private int[] getColdStorageScores(String stTime,String edTime,Integer rdcId,WeightSetEntity weightSet){
		double qe=0,hwarcount=0,	lwarcount=0;int ishasplc=0;
		List<HashMap<String, Object>> sumElist = this.quantityMapper.getsumEByRdcid(rdcId, stTime,edTime);
		List<HashMap<String, Object>> sumQlist = this.quantityMapper.getsumQByRdcid(rdcId, stTime,edTime);
		List<HashMap<String, Object>> warCounList = this.quantityMapper.getWarCountByTime(rdcId, stTime, edTime);
		if(SetUtil.isnotNullList(sumElist)&&SetUtil.isnotNullList(sumQlist)){
		    double	allsumq=0;  double	allsume=0;
			for (HashMap<String, Object> hashMap : sumQlist) { allsumq+=(Double) hashMap.get("sumq");}
			for (HashMap<String, Object> hashMap : sumElist) { allsume+=(Double) hashMap.get("sume"); }
			if(allsume!=0&&allsumq!=0){qe=(allsumq/allsume)* weightSet.getCrew1();}
			if(qe<0){return new int[]{1,0};}else if(qe>=100){qe=75;}//
			ishasplc=1;
		}
		if(SetUtil.isnotNullList(warCounList)){
			ishasplc=1;
			for (HashMap<String, Object> hashMap : warCounList) {
				if(hashMap.containsKey("HighWarningCount")){
					hwarcount=(Double) hashMap.get("val")*weightSet.getCrew2();
				}else if(hashMap.containsKey("LowWarningCount")){
					lwarcount=(Double) hashMap.get("val")*weightSet.getCrew3();
				}
			}
		}
		int soure= (int) (100-qe-hwarcount-lwarcount);
		if(soure<35){soure=35;}
		return new int[]{ishasplc,soure};
	}

	private int  getColorVal(int tempS ){
		if( tempS >=70&&tempS<=99){
			return Integer.parseInt((tempS+"").substring(0,1)+"0");
		}else if(tempS>=100){
			return 100;
		}
		return 60;
	}
	

}
