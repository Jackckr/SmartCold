package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageDoorSetMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.WeightSetMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;
import com.smartcold.manage.cold.entity.olddb.WeightSetEntity;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 体检Controller
 * 
 * @author MaQiang
 *
 */
@Controller
@RequestMapping(value = "/physicalController")
public class PhysicalController {
	@Autowired
	private QuantityMapper quantityMapper;
	@Autowired
	private StorageService storageService;
	@Autowired
	private WeightSetMapper weightSetMapper;
	@Autowired
	private ColdStorageSetMapper coldsetServer;
	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceObjectMappingDao;
    private 	DecimalFormat    df   = new DecimalFormat("######0.00"); 
    
    
    
    /**
	 * 获得机组运行状态
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
		String stTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(30))+" 00:00:00";
		String edTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(0))+ " 23:59:59";
		HashMap<String, Object> resMap = getPysicalInfo(rdcId,  stTime, edTime);
		return ResponseData.newSuccess(resMap);
	}
	/**
	 * 获得月体检报告
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/mothCheckup")
	@ResponseBody
	public ResponseData<HashMap<String, Object>> mothCheckup(Integer rdcId,String stTime,String edTime ) {
		if(rdcId==null){ return ResponseData.newFailure("0");}//0.非法请求
		HashMap<String, Object> resMap = getPysicalInfo(rdcId,  stTime, edTime);
		resMap.put("compName", this.quantityMapper.getCompNameByRdcId(rdcId));//查询集团名称
		return ResponseData.newSuccess(resMap);
	}
	
	private HashMap<String, Object> getPysicalInfo(Integer rdcId,  String stTime, String edTime) {
		boolean ishasTempDEV=false;boolean ishasplc=false;
		HashMap<String, Object> resMap=new HashMap<String, Object>();
		WeightSetEntity weightSet = this.weightSetMapper.getWeightSet(rdcId);//占比
		if(weightSet==null){weightSet=new WeightSetEntity(0,2,10,10,2,3,0,30,5,1);};
		List<ColdStorageSetEntity> coldStorageSetList = coldsetServer.findByRdcId(rdcId);
		if(SetUtil.isnotNullList(coldStorageSetList)){	//1.2检查冷库信息 
			Integer oid= coldStorageSetList.get(0).getId();
			 ishasplc=	this.hasplc(1, "coldstorage", oid, "Temp", stTime, edTime);//plc
			 ishasTempDEV= this.hasdev(1, "coldstorage", oid, "Temp", stTime, edTime);//1.1检查温度是否有设备
			if(ishasTempDEV){ //2.2檢查設備(进行评估冷库)
				double sumtempS = 0; double sumsransportS=0; 
				HashMap<Integer, Object> tempScores=new HashMap<Integer, Object>();
				HashMap<Integer, Object> transportScores=new HashMap<Integer, Object>();
				for (ColdStorageSetEntity obj : coldStorageSetList) {
					int tempS = this.getTempScores( stTime, edTime, obj, weightSet);
					int sransportS=this.getTransportScores(stTime, edTime, obj, weightSet);
					sumtempS+=tempS; sumsransportS+=sransportS;
					tempScores.put(obj.getId(), new Object[]{getColorVal(tempS),Double.parseDouble(df.format( tempS))});//1.获取冷库的分数
					transportScores.put(obj.getId(),new Object[]{getColorVal(sransportS),Double.parseDouble(df.format(sransportS)) });//2.运管分数
					
				}
				resMap.put("TempScores",tempScores );
				resMap.put("TransportScores",transportScores );
				resMap.put("avgTempScores",(int)sumtempS/coldStorageSetList.size());
				resMap.put("avgTransportScores",(int)sumsransportS/coldStorageSetList.size() );
	        }
			if(ishasplc){
				int coldStorage = this.getColdStorageScores(stTime, edTime, rdcId, weightSet);
				resMap.put("coldStorage",coldStorage );
			}
		}
		resMap.put("ishasplc", ishasplc);
		resMap.put("ishasTempDEV", ishasTempDEV);
		return resMap;
	}
	private int  getColorVal(int tempS ){
		if( tempS >=70&&tempS<=99){
			return Integer.parseInt((tempS+"").substring(0,1)+"0");
		}else if(tempS>=100){
			return 100;
		}
		return 60;
	}
	
	/**
	 * 判斷是否有设备
	 * @param type
	 * @param table
	 * @param oid
	 * @param key
	 * @param stTime
	 * @param edTime
	 * @return
	 */
	private boolean hasdev(int type,String table,int oid,String key, String stTime, String edTime){
		DeviceObjectMappingEntity deviceEntity = deviceObjectMappingDao.findInfoByTypeOid(type, oid);
		if (deviceEntity != null) {
			return true;// return this.quantityMapper.getCountBydevkey(deviceEntity.getDeviceid(), key, stTime, edTime)>0;//最终看使用哪种
		} else {
			return this.quantityMapper.getCountBykey(oid, table, key, stTime, edTime)!=null;
		}
	}
	private boolean hasplc(int type,String table,int oid,String key, String stTime, String edTime){
		DeviceObjectMappingEntity deviceEntity = deviceObjectMappingDao.findInfoByTypeOid(type, oid);
		if (deviceEntity ==null) {
			return this.quantityMapper.getCountBykey(oid, table, key, stTime, edTime)!=null;
		} else {
			return false;
		}
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
	private int getTempScores(String stTime,String edTime,ColdStorageSetEntity obj,WeightSetEntity weightSet){
		try {
			double chaowenyinzi=0;double baowenyinzi=0;double jiangwenyinzi=0;
			double maxtemp=this.quantityMapper.getSisBayKey(1,obj.getId(), "MaxTemp", stTime, edTime);
		    double temcuf=(maxtemp-obj.getStartTemperature()-obj.getTempdiff()); 
		    if(temcuf>0){temcuf=temcuf*weightSet.getFactor2();}else{temcuf=0;}
			List<HashMap<String, Object>> avgTempYinZi = this.quantityMapper.getAVGTempYinZi(obj.getId(), stTime, edTime);
			for (HashMap<String, Object> hashMap : avgTempYinZi) {
				if(hashMap.containsKey("ChaoWenYinZi")){
					chaowenyinzi=(Double) hashMap.get("ChaoWenYinZi");
					if(chaowenyinzi>0){chaowenyinzi=chaowenyinzi*weightSet.getFactor1();}else{chaowenyinzi=0;}
				}else if(hashMap.containsKey("BaoWenYinZi")){
					baowenyinzi=(Double) hashMap.get("BaoWenYinZi");
					if(baowenyinzi>0){baowenyinzi=baowenyinzi*weightSet.getFactor3();}else{baowenyinzi=0;}
				}else if(hashMap.containsKey("JiangWenYinZi")){
					jiangwenyinzi=(Double) hashMap.get("JiangWenYinZi");
					if(jiangwenyinzi!=0&&jiangwenyinzi>0){jiangwenyinzi=1/jiangwenyinzi*weightSet.getFactor4();}else{jiangwenyinzi=0;}
				}
			}
			return (int)Math.abs(100-chaowenyinzi-temcuf-baowenyinzi-jiangwenyinzi);
		} catch (Exception e) {
			e.printStackTrace();
		}
        return 65;
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
	private int getTransportScores(String stTime,String edTime,ColdStorageSetEntity obj,WeightSetEntity weightSet){
		try {
			double emgodunit=0;
			Double doorAvgTime	=this.quantityMapper.getSisBayKey(1,obj.getId(), "DoorAvgTime", stTime, edTime);//获得平均开门时间
			if(doorAvgTime!=null&&doorAvgTime>0){doorAvgTime=(doorAvgTime/3600)*weightSet.getTransport1();}else{doorAvgTime=new Double(0);}
			List<HashMap<String, Object>> goodQuantit = this.quantityMapper.getGoodQuantit(obj.getId(), stTime, edTime);
			if (SetUtil.isnotNullList(goodQuantit)&&goodQuantit.get(0)!=null) {
			  Double  temp=	 (Double) goodQuantit.get(0).get("temp");
			  Double quantit=(Double) goodQuantit.get(0).get("quantit");
			  emgodunit= quantit*(temp-obj.getStartTemperature())*weightSet.getTransport2();
			  if(emgodunit<0){emgodunit=0;}
			}
		  return (int)Math.abs(100-doorAvgTime-emgodunit);
		} catch (Exception e) {
			e.printStackTrace();
		}
        return 45;
	}
	/**
	 * 机组分析
	 * @param key
	 * @param type
	 * @param stTime
	 * @param edTime
	 * @param obj
	 * @param weightSet
	 * @return
	 * GoodsHeat
	 */
	private int getColdStorageScores(String stTime,String edTime,Integer rdcId,WeightSetEntity weightSet){
		double qe=0;double	hwarcount=0;double	lwarcount=0;
		List<HashMap<String, Object>> sumElist = this.quantityMapper.getsumEByRdcid(rdcId, stTime,edTime);
		List<HashMap<String, Object>> sumQlist = this.quantityMapper.getsumQByRdcid(rdcId, stTime,edTime);
		List<HashMap<String, Object>> warCounList = this.quantityMapper.getWarCountByTime(rdcId, stTime, edTime);
		if(SetUtil.isnotNullList(sumElist)&&SetUtil.isnotNullList(sumQlist)){
		    double	allsumq=0;  double	allsume=0;
			for (HashMap<String, Object> hashMap : sumQlist) { allsumq+=(Double) hashMap.get("sumq");}
			for (HashMap<String, Object> hashMap : sumElist) { allsume+=(Double) hashMap.get("sume"); }
			if(allsume!=0&&allsumq!=0){qe=(allsumq/allsume)* weightSet.getCrew1();}
			if(qe<0){return 0;}else if(qe>=100){qe=75;}//
		}
		if(SetUtil.isnotNullList(warCounList)){
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
		return soure;
	}
}
