package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.ColdStorageAnalysisMapper;
import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.NewColdStorageMapper;
import com.smartcold.manage.cold.dao.newdb.PowerMapper;
import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.PowerSetMapping;
import com.smartcold.manage.cold.dao.olddb.QuantitySetMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.NewColdStorageEntity;
import com.smartcold.manage.cold.entity.newdb.PowerEntity;
import com.smartcold.manage.cold.entity.newdb.WarningsInfo;
import com.smartcold.manage.cold.entity.newdb.WarningsLog;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.entity.olddb.WarningMsgEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.MsgService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * Copyright (C) DCIS 版权所有 功能描述: MsgServiceimp Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class MsgServiceimp implements MsgService {

	@Autowired
	private RdcMapper rdcMapper;
	@Autowired
	private MessageMapper megMapper;
	@Autowired
	private PowerMapper powerMapper;
	@Autowired
	private ColdStorageSetMapper coldStorageSetMapper;
	@Autowired
	private NewColdStorageMapper newColdStorageMapper;
	@Autowired
	private PowerSetMapping powerSetMapping;
	@Autowired
	private StorageService storageService;
	@Autowired
	private WarningsInfoMapper warningsInfoMapper;
	@Autowired
	private WarningLogMapper warningLogMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceMapper;
	@Autowired
	private ColdStorageAnalysisMapper storageAnalysisMapper;
	/**
	 * 计算Q
	 */
	@Autowired
	private QuantityMapper quantityMapper;
	@Autowired
	private QuantitySetMapper quantitySetMapper;
	@Autowired
	private ColdStorageAnalysisMapper sisMapper;

	/**
	 * 5分钟执行一次
	 * Task:检查数据是否执行报警 
	 */
     @Scheduled(cron="0 0/5 * * * ?")  
	public void checkData() {
	    boolean taskStatus=	quantityMapper.updateTaskStatus(1);
		if(taskStatus){
			this.getERRinfo();
			addextMsg("checkData",1, null);//记录日志
		}
	}
	/**
	 * 半小时执行一次
	 * Task:检查AP
	 * stupe 1.检查哪些库进行关联配置 2.将配置对象放进线程池进行监听保护 StorageService-》findByTime
	 * 3.超过系统规定时间 ，发送短信通知。。
	 * 
	 */
	@Scheduled(cron = "0 0/30 * * * ?")
	public void checkAPStatus() {
		boolean taskStatus = quantityMapper.updateTaskStatus(2);
		if(!taskStatus){return ;}
		addextMsg("checkAPStatus", 2,null);//记录日志
		long currentTime = System.currentTimeMillis() - 1800000;
		Date startTime = new Date(currentTime);
		Date endTime = new Date();
		List<Map<String, Object>> findRdcManger = this.rdcMapper.findRdcManger();// 查找监听保护对象
		Map<Integer, String> telMap = new HashMap<Integer, String>();
		if (SetUtil.isnotNullList(findRdcManger)) {
			HashMap<String, Object> filter = new HashMap<String, Object>();
			String rdcidlist = "";
			for (Map<String, Object> map : findRdcManger) {
				int rdcid = (Integer) map.get("rdcid");
				rdcidlist += rdcid + ",";
				telMap.put(rdcid, map.get("telephone").toString());
			}
			filter.put("status", 1);// 检查正常的devcice是否正常工作
			filter.put("rdcid", rdcidlist.substring(0, rdcidlist.length() - 1));
			List<DeviceObjectMappingEntity> devciceList = this.deviceMapper.findInfoByfilter(filter);
			sendMsg(devciceList, telMap,startTime,endTime);
		}
	}
	/**
	 * 每天凌晨3:30点触发
	 * Task:计算热量
	 */
	@Scheduled(cron = "0 30 3 * * ?")
	public void reckonQuantity() {
	   boolean taskStatus = quantityMapper.updateTaskStatus(3);
		if(!taskStatus){return ;}
		addextMsg("reckonQuantity",3, null);//记录日志
		String time = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(1));
		Date dateTime = TimeUtil.parseYMD(time);
		String startTime= time+ " 00:00:00";String endtime =time+ " 23:59:59";
	    this.setQFrost(time,dateTime); //2 Q霜
	    this.setQblower(endtime, dateTime);//6 Q风
		this.setQForklift(time,dateTime,startTime,endtime);//3 Q叉,4 Q照
		this.setQctdoor(time, dateTime, startTime, endtime);//Q門
	}
  
    
    /**
     *跑完之前的值
     * Task:计算热量
     */
    public void initReckonQuantity() {
    	for (int i = 2; i <=30; i++) {
    		String time = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(i));
        	Date dateTime = TimeUtil.parseYMD(time);
        	String startTime= time+ " 00:00:00";String endtime =time+ " 23:59:59";
        	HashMap<String, Object> fileter = new HashMap<String, Object>();
			fileter.put("type", 4);
			fileter.put("time", time);
			fileter.put("key", "'QFrost'");
		    List<ColdStorageAnalysisEntity> blowersisdata = storageAnalysisMapper.findValueByFilter(fileter);
        	if(SetUtil.isNullList(blowersisdata)){
        		this.setQFrost(time,dateTime); //2 Q霜
            	this.setQblower(endtime, dateTime);//6 Q风
            	this.setQForklift(time,dateTime,startTime,endtime);//3 Q叉,4 Q照
            	this.setQctdoor(time, dateTime, startTime, endtime);//Q門
        	}
		}
    }
	
	
	
	/**
	 * 检查数据是否正常
	 * 1.电压：SELECT *  FROM `power`  where  `value` =0 and `key` LIKE  '_U' and `addtime` >'2016-10-20 10:00:00';
	 * 2.电流： SELECT * from ( SELECT id, `key`, `value`, CASE WHEN ( (MAX(`value`) - MIN(`value`)) / MAX(`value`) * 100 ) > 15 THEN 1 ELSE 0 END AS vl FROM `power` WHERE oid=13 AND `key` LIKE '_I' AND `value` > 10 AND `addtime` > #{startTime} GROUP BY `addtime`, `oid` ORDER BY `addtime` ASC ) as c WHERE c.vl = 1
	 * 3.温度：
	 * @param startTime
	 */
	public void getERRinfo(){
		try {
			WarningsLog waLog = null;
			Date startTime = TimeUtil.getBeforeMinute(5);//
			List<WarningsLog> errInfoList = new ArrayList<WarningsLog>();
			List<WarningsInfo> fErrWarningList = this.warningsInfoMapper.findErrWarningByTime(startTime);// PLC报警
			if (SetUtil.isnotNullList(fErrWarningList)) {//
				errInfoList.addAll(errInfoList);
			}
			List<PowerEntity> ublowerlist = this.powerMapper .findUBlowerByTime(startTime);// 电压缺相报警-
			if (SetUtil.isnotNullList(ublowerlist)) {
				List<Integer> poweid = new ArrayList<Integer>();
				for (PowerEntity pow : ublowerlist) {
					poweid.add(pow.getId());
				}
				String powids = poweid.toString();
				powids = powids.substring(1, powids.length() - 1);
				List<PowerSetEntity> powerSetList = this.powerSetMapping
						.findByFilter(null, powids);
				HashMap<Integer, PowerSetEntity> powerSetMap = new HashMap<Integer, PowerSetEntity>();
				if (SetUtil.isnotNullList(powerSetList)) {
					for (PowerSetEntity powerSet : powerSetList) {
						powerSetMap.put(powerSet.getId(), powerSet);
					}
				}
				for (PowerEntity power : ublowerlist) {
					waLog = new WarningsLog();
					PowerSetEntity powerSetEntity = powerSetMap.get(power.getOid());
					if (powerSetEntity != null) {
						waLog.setRdcid(powerSetEntity.getRdcid());
						waLog.setMsg(powerSetEntity.getName()
								+ power.getKey() + "相电压缺相");
						errInfoList.add(waLog);
					}
				}
			}
			List<PowerSetEntity> powerSetList = this.powerSetMapping.findByFilter(
					0, null);// 检查有配置的电表电流->需多线程处理
			if (SetUtil.isnotNullList(powerSetList)) {
				for (PowerSetEntity powerSetEntity : powerSetList) {
					List<PowerEntity> iBlowerList = this.powerMapper
							.findIBlowerByTime(powerSetEntity.getId(),
									powerSetEntity.getIunbalance(), startTime);// 电流异常报警
					if (SetUtil.isnotNullList(iBlowerList)) {
						for (PowerEntity power : iBlowerList) {
							waLog = new WarningsLog();
							waLog.setRdcid(powerSetEntity.getRdcid());
							waLog.setMsg(powerSetEntity.getName()
									+ power.getKey() + "电流不平衡");
							errInfoList.add(waLog);
						}
					}
				}

			}
			//溫度報警
			List<ColdStorageSetEntity> coldStorageSetList = this.coldStorageSetMapper.findByFilter(0);
			if (SetUtil.isnotNullList(coldStorageSetList)) {
				for (ColdStorageSetEntity coldStorageSetEntity : coldStorageSetList) {
					List<NewColdStorageEntity> iBlowerList = this.newColdStorageMapper.findIBlowerByTime(coldStorageSetEntity.getId(), 
							coldStorageSetEntity.getStartTemperature()+coldStorageSetEntity.getOvertempalarm(), coldStorageSetEntity.getOvertempdelay(),"Temp", startTime);
					if (SetUtil.isnotNullList(iBlowerList)) {
						for (NewColdStorageEntity newColdStorageEntity : iBlowerList) {
							waLog=new WarningsLog();
							waLog.setRdcid(coldStorageSetEntity.getRdcId());
							waLog.setMsg(coldStorageSetEntity.getName()+newColdStorageEntity.getKey()+"温度不正常");
							errInfoList.add(waLog);
						}
					}
					
				}
			}
			if (SetUtil.isnotNullList(errInfoList)) {
				this.warningLogMapper.addWarningLog(errInfoList);
			}
		} catch (Exception e) {
			addextMsg("getERRinfo",1, e.getMessage());//记录日志
		}
	}

	/**
	 * 定义消息组件
	 * 
	 * @param devciceList
	 * @param telMap
	 */
	private void sendMsg(List<DeviceObjectMappingEntity> devciceList, Map<Integer, String> telMap,Date startTime,Date endTime) {
		if (SetUtil.isnotNullList(devciceList)) {
			Map<String, Object> resMap = null;
			LinkedHashMap<Integer, Map<String, Object>> tempData = new LinkedHashMap<Integer, Map<String, Object>>();
			for (DeviceObjectMappingEntity obj : devciceList) {
				resMap = new HashMap<String, Object>();
				Integer size = storageService .findCounSizeByTime(obj.getType(), obj.getOid(), obj.getDeviceid(), "", startTime, endTime);
				if (size != null && size == 0) {
					String oidname = "";
					List<HashMap<String, Object>> oidobj = this.megMapper .findObjsetByOid( StorageType.getStorageType(obj.getType()) .getTable(), obj.getOid());
					if (SetUtil.isnotNullList(oidobj)) {
						oidname = (String) oidobj.get(0).get("name");
					}
					if (tempData.containsKey(obj.getRdcid())) {
						resMap = tempData.get(obj.getRdcid());
						resMap.put("devicetype", resMap.get("devicetype") + "," + oidname);
						resMap.put("deviceid", resMap.get("deviceid") + ","
								+ obj.getDeviceid());
					} else {
						resMap.put("rdcname", this.rdcMapper .selectByPrimaryKey(obj.getRdcid()).getName());
						resMap.put("deviceid", obj.getDeviceid());
						resMap.put("devicetype", oidname);
					}
					tempData.put(obj.getRdcid(), resMap);
				}
			}
			//发送短信和通知
			if (tempData.size() > 0) {
				try {
					WarningMsgEntity info = null;
					HashMap<String, Object> updata = null;
					for (int rdcid : tempData.keySet()) {
						Map<String, Object> map = tempData.get(rdcid);
						String tels = telMap.get(rdcid);
						String msg = "【Warning】{RDC=" + map.get("rdcname")
								+ "}{" + map.get("devicetype") + "}{Dev="
								+ map.get("deviceid") + "}已经超过30分钟未上报数据，请注意检查";
						info = new WarningMsgEntity(0, rdcid, "告警通知", tels, msg);
						this.megMapper.addwarningmessage(info);
						updata = new HashMap<String, Object>();
						updata.put("rdcid", rdcid);//
						updata.put("status", 0);
						updata.put("deviceids", map.get("deviceid"));
						this.deviceMapper.upDeviceObjectStatus(updata);
						updata.clear();
						updata.put("rdc", "\nRDC={" + map.get("rdcname") + "}");
						updata.put("rdctype",
								"deviceidtyoe={" + map.get("devicetype") + "}");
						updata.put("dev", "deviceid={" + map.get("deviceid")
								+ "}");
						updata.put("telephone", tels);
						RemoteUtil.httpPost(
								"http://liankur.com/i/warning/warningTele",
								updata);
					}
				} catch (Exception e) {
					addextMsg("sendMsg", 2,e.getMessage());//记录日志
				}
			}
		}
	}


   /**
    * 组建键值对
    * @param blids
    * @param blfrostPowers
    * @return
    */
	private HashMap<Integer, Double> getValueMap(String blids, String blfrostPowers) {
		String[] blidarr = StringUtil.splitfhString(blids);
		String[] blfrossrr = StringUtil.splitfhString(blfrostPowers);
		HashMap<Integer, Double> tempMap = new HashMap<Integer, Double>();
		for (int i = 0; i < blidarr.length; i++) {
			tempMap.put(Integer.parseInt(blidarr[i]), 	Double.parseDouble(blfrossrr[i]));
		}
		return tempMap;
	}

	/**
	 * 2 Q霜=Σ（P霜*t霜累积）->ok
	 *   type=4 ,key='Qblower',valkey='Qblower'
	 *   1. select coldStorageId,group_concat(`id`) ids, ,group_concat(`frostPower`) frostPowers  from blowerset where  `frostPower` >0  GROUP BY `coldStorageId`;
	 *   2. select * from `coldstorageanalysis` where 1=1 AND `type` = 4 AND `key`in ('DefrosingTime') AND `oid` in (26,28)   AND `date` BETWEEN '2016-10-17 00:00:00'  and '2016-10-17 23:59:59'  order by `date`,`oid` ;
	 */
	private void setQFrost(String time, Date dateTime) {
			try {
				HashMap<Integer, Double> tempMap = null;
				List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
				List<HashMap<String, Object>> blowerList = this.quantitySetMapper.findFrostPower(null);// 按冷库分组查询
				if (SetUtil.isnotNullList(blowerList)) {
					HashMap<String, Object> fileter = new HashMap<String, Object>();
					fileter.put("type", 4);fileter.put("time", time);fileter.put("key", "'DefrosingTime'");
					for (HashMap<String, Object> blowerinf : blowerList) {
						String blids =(String) blowerinf.get("ids");
						String blfrostPowers = (String) blowerinf.get("frostPowers");
						Integer coldStorageId =(Integer) blowerinf.get("coldStorageId");
						tempMap = getValueMap(blids, blfrostPowers);
						fileter.put("oid", blids);
						double qfrost=0;
						List<ColdStorageAnalysisEntity> blowersisdata = storageAnalysisMapper.findValueByFilter(fileter);
						if (SetUtil.isnotNullList(blowersisdata)) {
							for (ColdStorageAnalysisEntity clsis : blowersisdata) {
								 qfrost+= tempMap.get(clsis.getOid()) * clsis.getValue();
							}
							sisList.add(new ColdStorageAnalysisEntity(1, coldStorageId, "QFrost", qfrost, dateTime));
						} 
					}
					if(SetUtil.isnotNullList(sisList)){
						this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
					}
				}
			} catch (Exception e) {
				addextMsg("reckonQuantity", 3,e.getMessage());//记录日志
			}
	}
	
	/**
	 * 6 Q风=Σ（P风*t风累积）->ok
	 * type=4  ,key='totalRunning',valkey='Qblower' 
	 * 1.SELECT  rdcid, group_concat(id) ids ,group_concat(power) powers FROM `forkliftset` where `power` >0 GROUP BY rdcid; 计算平均功率
	 * 2. select * from `coldstorageanalysis` where 1=1 AND `type` = 4 AND `key`in ('DefrosingTime') AND `oid` in (26,28)   AND `date` BETWEEN '2016-10-17 00:00:00'  and '2016-10-17 23:59:59'  order by `date`,`oid` ;
	 */
	private void setQblower(String time, Date dateTime) {
		try {
			HashMap<Integer, Double> tempMap = null;
			List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
			List<HashMap<String, Object>> blowerList = this.quantitySetMapper.findFanPower(null);// 按冷库分组查询
			if (SetUtil.isnotNullList(blowerList)) {
				HashMap<String, Object> fileter = new HashMap<String, Object>();
				fileter.put("type", 4);
				fileter.put("time", time);
				fileter.put("key", "'totalRunning'");
				for (HashMap<String, Object> blowerinf : blowerList) {
					String blids = (String) blowerinf.get("ids");
					String blfrostPowers = (String) blowerinf.get("fanPowers");
					Integer coldStorageId =(Integer) blowerinf.get("coldStorageId");
					tempMap = getValueMap(blids, blfrostPowers);
					fileter.put("oid", blids);
					double qfrost=0;
					List<ColdStorageAnalysisEntity> blowersisdata = storageAnalysisMapper.findValueByFilter(fileter);
					if (SetUtil.isnotNullList(blowersisdata)) {
						for (ColdStorageAnalysisEntity clsis : blowersisdata) {
							 qfrost += tempMap.get(clsis.getOid()) * clsis.getValue();
						}
						sisList.add(new ColdStorageAnalysisEntity(1, coldStorageId, "Qblower", qfrost, dateTime));
					} 
				}
				if(SetUtil.isnotNullList(sisList)){
					this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
				}
			}
		} catch (Exception e) {
			addextMsg("setQblower", 3,e.getMessage());//记录日志
		}
	}

	/**
	 * 3 Q叉=Σ（P叉*t叉累积）-------->备注 ：由于叉车没有数据   按开门时间推算  后期需整改
	 * 4 Q照=Σ（P照*t照累积）-------->备注 ：由于叉车没有数据   按开门时间推算  后期需整改
	 *  type=2  ,key='TotalTime',valkey='QForklift' -->type=14
	 *   type=2 ,key='?'        ,valkey='Qlighting' -->type=15
	 * 1.SELECT rdcid,coldstorageid, group_concat(id) ids  FROM `coldstoragedoorset` GROUP BY coldstorageid;
	 * 2.SELECT  rdcid, group_concat(id) ids ,group_concat(power) powers FROM `forkliftset` where `power` >0 GROUP BY rdcid; 计算平均功率
	 * 3.select * from `coldstorageanalysis` where 1=1 AND `type` = 2 AND `key`in ('TotalTime') AND `oid` in (26,28)   AND `date` BETWEEN '2016-10-17 00:00:00'  and '2016-10-17 23:59:59'  order by `date`,`oid` ;
	 */
	private void setQForklift(String time, Date dateTime,String startTime,String endTime) { //为机群服务器队列任务做准备
			try {
				double avgforkliftPower=0;
				double avglightsetPower=0;
				List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
				List<HashMap<String, Object>> doorsetList =this.quantitySetMapper.getcoldstoragedoorset();//rdcid,  ids
				if(SetUtil.isnotNullList(doorsetList)&&doorsetList.get(0)!=null){
					HashMap<String, Object> fileter = new HashMap<String, Object>();
					fileter.put("type", 2);
					fileter.put("time", time);
					fileter.put("key", "'TotalTime'");
					  for (HashMap<String, Object> hashMap : doorsetList) {
								avgforkliftPower=0; avglightsetPower=0; double sumForklift=0; double sumlighting=0;
								Object rdcid=hashMap.get("rdcid");
								Integer coldstorageid=(Integer) hashMap.get("coldstorageid");
							    fileter.put("oid", hashMap.get("ids"));
							    List<ColdStorageAnalysisEntity> doorTotalTime = storageAnalysisMapper.findValueByFilter(fileter);
							    if(SetUtil.isnotNullList(doorTotalTime)){
							    	List<HashMap<String, String>> forkliftsetList = this.quantitySetMapper.getPowerGroupByRDC("forkliftset", rdcid);//获得叉车功率
							    	List<HashMap<String, String>> lightsetList = this.quantitySetMapper.getPowerGroupByRDC("coldstoragelightset", rdcid);//获得照明功率
							    	if(SetUtil.isnotNullList(forkliftsetList)){
							    		avgforkliftPower =Double.parseDouble( forkliftsetList.get(0).get("avgpower")+"");
							    	}
							    	if(SetUtil.isnotNullList(lightsetList)){
							    		avglightsetPower =Double.parseDouble( lightsetList.get(0).get("avgpower")+"");
							    	}
							    	for (ColdStorageAnalysisEntity clsis : doorTotalTime) {
							    		if(avgforkliftPower!=0){
							    			sumForklift+=avgforkliftPower * clsis.getValue();
							    		}
							    		if(avglightsetPower!=0){
							    			sumlighting+=avglightsetPower * clsis.getValue();
							    		}
									 }
							    	if(sumForklift==0){
							    	  sisList.add(new ColdStorageAnalysisEntity(1,coldstorageid, "QForklift", sumForklift, dateTime));
							    	}
							    	if(sumlighting==0){
							    		sisList.add(new ColdStorageAnalysisEntity(1,coldstorageid, "Qlighting", sumlighting, dateTime));
							    	}
							    }
					  } 
					if(SetUtil.isnotNullList(sisList)){
						this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				addextMsg("setQForklift", 3,e.getMessage());//记录日志
			}
	}
	
	/**
	 * 7 Q门=0.675*(Wq*Lq*Hq）*n*（Hw-Hn）
	 * 1:见数据库
	 * 
	 */
	private void setQctdoor(String time, Date dateTime,String startTime,String endTime) {
		try {
			List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
			List<HashMap<String, Object>> coldstoragesetList = this.quantitySetMapper.getColdstorageset();
			if (SetUtil.isnotNullList(coldstoragesetList)) {
				for (HashMap<String, Object> hashMap : coldstoragesetList) {
					if(hashMap.get("hn")!=null  &&hashMap.get("hw")!=null){
						    int id = (Integer) hashMap.get("id");//coldstorageset->id
						    Double cgvolume=(Double) hashMap.get("cgvolume");//冷库面积d
						    Double vvalue=	(Double) hashMap.get("vvalue");//换气次数d
						    Float hn=	(Float) hashMap.get("hn");//换气次数
						    Float hw=	(Float) hashMap.get("hw");//换气次数
						    Double Q=0.675*cgvolume*vvalue*(hw-hn);//临时值
							sisList.add(new ColdStorageAnalysisEntity(1, id, "Qctdoor", Q, dateTime));
					 }
				 }
				 if(SetUtil.isnotNullList(sisList)){
					this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
				 }
			}
		} catch (Exception e) {
			e.printStackTrace();
			addextMsg("setQctdoor",3, e.getMessage());//记录日志
		}
	}
    
	private void addextMsg(String methodName,int type,String errMsg){
		String msg="IP:"+RemoteUtil.getServerIP()+" 时间："+TimeUtil.getDateTime()+" 开始执行："+methodName;
		if(StringUtil.isnotNull(errMsg)){
			if(errMsg.length()>200){errMsg=errMsg.substring(0, 200);}
			 msg+=" 执行错误："+errMsg; 
		   }
		System.err.println(msg);
		List<WarningsLog> errInfoList=new ArrayList<WarningsLog>();
		errInfoList.add(new WarningsLog(-1,type,msg));
		this.warningLogMapper.addWarningLog(errInfoList);
	}
	
	public static void main(String[] args) {
		long currentTime = System.currentTimeMillis() - 1800000;
		Date startTime = new Date(currentTime);
		Date endTime = new Date();
		System.err.println(  TimeUtil.getDateTime(startTime) );
		System.err.println(  TimeUtil.getDateTime(endTime) );
	}
	
	
}
