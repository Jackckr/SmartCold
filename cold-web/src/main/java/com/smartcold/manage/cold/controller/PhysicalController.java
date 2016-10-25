package com.smartcold.manage.cold.controller;

import java.text.DecimalFormat;
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
import com.smartcold.manage.cold.entity.olddb.WeightSetEntity;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
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
	private StorageService storageService;
	@Autowired
	private WeightSetMapper weightSetMapper;
	@Autowired
	private ColdStorageSetMapper coldsetServer;
	@Autowired
	private QuantityMapper quantityMapper;
	@Autowired
	private ColdStorageDoorSetMapper coldStorageDoorSetMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceObjectMappingDao;
    private 	DecimalFormat    df   = new DecimalFormat("######0.00"); 
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
		List<ColdStorageSetEntity> coldStorageSetList = coldsetServer.findByRdcId(rdcId);
		String stTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(30))+" 00:00:00";
		String edTime = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(0))+ " 23:59:59";
		WeightSetEntity weightSet = this.weightSetMapper.getWeightSet(rdcId);//占比
		if(weightSet==null){weightSet=new WeightSetEntity(0,2,10,10,2,3,0,30,5,1);};
		//1.2检查冷库信息 
		boolean ishasTempDEV=false;
		HashMap<String, Object> resMap=new HashMap<String, Object>();
		if(SetUtil.isnotNullList(coldStorageSetList)){
			Integer oid= coldStorageSetList.get(0).getId();
			 ishasTempDEV= this.hasdev(1, "coldstorage", oid, "Temp", stTime, edTime);//1.1检查温度是否有设备
			if(ishasTempDEV){ //2.2檢查設備(进行评估冷库)
				double sumtempS = 0; double sumsransportS=0; double sumColdStorageS=0;
				HashMap<Integer, Object> tempScores=new HashMap<Integer, Object>();
				HashMap<Integer, Object> transportScores=new HashMap<Integer, Object>();
				HashMap<Integer, Object> coldStorageScores=new HashMap<Integer, Object>();
				for (ColdStorageSetEntity obj : coldStorageSetList) {
					int tempS = this.getTempScores( stTime, edTime, obj, weightSet);
					int sransportS=this.getTransportScores(stTime, edTime, obj, weightSet);
					int coldStorageS = this.getColdStorageScores(stTime, edTime, obj, weightSet);
					sumtempS+=tempS; sumsransportS+=sransportS;sumColdStorageS+=coldStorageS;
					tempScores.put(obj.getId(), new Object[]{getColorVal(tempS),Double.parseDouble(df.format( tempS))});//1.获取冷库的分数
					transportScores.put(obj.getId(),new Object[]{getColorVal(sransportS),Double.parseDouble(df.format(sransportS)) });//2.运管分数
					coldStorageScores.put(obj.getId(),new Object[]{getColorVal(coldStorageS),Double.parseDouble( df.format(coldStorageS))});
				}
				resMap.put("TempScores",tempScores );
				resMap.put("TransportScores",transportScores );
				resMap.put("ColdStorageScores",coldStorageScores );
				resMap.put("avgTempScores",(int)sumtempS/coldStorageSetList.size());
				resMap.put("avgTransportScores",(int)sumsransportS/coldStorageSetList.size() );
				resMap.put("avgColdStorageScores",(int)sumColdStorageS/coldStorageSetList.size());
	        }
		}
		resMap.put("ishasTempDEV", ishasTempDEV);
		return ResponseData.newSuccess(resMap);
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
	
    /**
     * 根据id对冷库评分
     * @param key
     * @param type
     * @param stTime
     * @param edTime
     * @param obj
     * @param weightSet
     * @return
     */
	private int getTempScores(String stTime,String edTime,ColdStorageSetEntity obj,WeightSetEntity weightSet){
		try {
			double chaowenyinzi=0;double baowenyinzi=0;double jiangwenyinzi=0;
			List<HashMap<String, Object>> avgTempYinZi = this.quantityMapper.getAVGTempYinZi(obj.getId(), stTime, edTime);
			for (HashMap<String, Object> hashMap : avgTempYinZi) {if(hashMap.containsKey("ChaoWenYinZi")){chaowenyinzi=(Double) hashMap.get("ChaoWenYinZi");}else if(hashMap.containsKey("BaoWenYinZi")){baowenyinzi=(Double) hashMap.get("BaoWenYinZi");}else if(hashMap.containsKey("JiangWenYinZi")){jiangwenyinzi=(Double) hashMap.get("JiangWenYinZi");}}
			double maxtemp=this.quantityMapper.getSisBayKey(1,obj.getId(), "MaxTemp", stTime, edTime);
		if(jiangwenyinzi!=0){jiangwenyinzi=	1/jiangwenyinzi*weightSet.getFactor4();}
			return (int)Math.abs(100-chaowenyinzi*weightSet.getFactor1()-(maxtemp-obj.getStartTemperature()-obj.getTempdiff())-baowenyinzi*weightSet.getFactor3()-jiangwenyinzi);
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
			if(doorAvgTime==null){doorAvgTime=new Double(0);}else{doorAvgTime=(doorAvgTime/3600);}
			List<HashMap<String, Object>> goodQuantit = this.quantityMapper.getGoodQuantit(obj.getId(), stTime, edTime);
			if (SetUtil.isnotNullList(goodQuantit)&&goodQuantit.get(0)!=null) {
			  Double  temp=	 (Double) goodQuantit.get(0).get("temp");
			  Double quantit=(Double) goodQuantit.get(0).get("quantit");
			  emgodunit= quantit*(temp-obj.getStartTemperature());
			}
		  return (int)Math.abs(100-doorAvgTime*weightSet.getTransport1()-emgodunit);
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
	private int getColdStorageScores(String stTime,String edTime,ColdStorageSetEntity obj,WeightSetEntity weightSet){
		
		return (int) Math.abs(100-obj.getColdStorageID()*2-obj.getTempdiff());
	}
}
