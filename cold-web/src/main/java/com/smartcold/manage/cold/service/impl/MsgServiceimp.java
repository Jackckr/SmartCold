package com.smartcold.manage.cold.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.smartcold.manage.cold.entity.newdb.ForkLiftEntity;
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
	 * stupe 1.检查哪些库进行关联配置 2.将配置对象放进线程池进行监听保护 StorageService-》findByTime
	 * 3.超过系统规定时间 ，发送短信通知。。
	 * 
	 */
//	@Scheduled(cron = "0 0/30 * * * ?")
	public void checkAPStatus() {
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
			sendMsg(devciceList, telMap);
		}
	}

	/**
	 * 计算热量 每天凌晨两点触发
	 */
	// @Scheduled(cron = "0 15 02 * * ?")
	public void reckonQuantity() {
		String time = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(1));
		Date dateTime = TimeUtil.parseYMD(time);
		String startTime= time+ " 00:00:00";String endtime =time+ " 23:59:59";
	    this.setQFrost(time,dateTime);
		this.setQForklift(time,dateTime,startTime,endtime);
	}
	
	/**
	 * 检查数据是否执行报警
	 */
//	@Scheduled(cron = "0 0/5 * * * ?")
	public void checkData() {
		System.err.println("开始工作。。。。。。。");
		WarningsLog waLog = null;
		List<WarningsLog> errInfoList = new ArrayList<WarningsLog>();
		Date startTime = TimeUtil.getBeforeMinute(5);//
		System.err.println("查询时间" + TimeUtil.getDateTime(startTime));
		List<WarningsInfo> fErrWarningList = this.warningsInfoMapper
				.findErrWarningByTime(startTime);// PLC报警
		if (SetUtil.isnotNullList(fErrWarningList)) {//
			errInfoList.addAll(errInfoList);
		}
		List<PowerEntity> ublowerlist = this.powerMapper
				.findUBlowerByTime(startTime);// 电压缺相报警-
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
					/*	System.out.println(coldStorageSetEntity.getRdcId());
						System.out.println(coldStorageSetEntity.getName()+newColdStorageEntity.getKey()+"温度不正常");*/
						waLog.setRdcid(coldStorageSetEntity.getRdcId());
						waLog.setMsg(coldStorageSetEntity.getName()+newColdStorageEntity.getKey()+"温度不正常");
						errInfoList.add(waLog);
					}
				}
				
			}
		}
		warningLogMapper.addWarningLog(errInfoList);
	}
	

	/**
	 * 定义消息组件
	 * 
	 * @param devciceList
	 * @param telMap
	 */
	private void sendMsg(List<DeviceObjectMappingEntity> devciceList, Map<Integer, String> telMap) {
		long currentTime = System.currentTimeMillis() + 1800000;
		Date startTime = new Date();
		Date endTime = new Date(currentTime);
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
					e.printStackTrace();
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
	 * 2 Q霜=Σ（P霜*t霜累积）
	 */
	private void setQFrost(String time, Date dateTime) {
			try {
				HashMap<Integer, Double> tempMap = null;
				ColdStorageAnalysisEntity sis = null;
				List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
				List<HashMap<String, String>> blowerList = this.quantitySetMapper.findFrostPower(null);// 按冷库分组查询
				if (SetUtil.isnotNullList(blowerList)) {
					HashMap<String, Object> fileter = new HashMap<String, Object>();
					fileter.put("type", 4);
					fileter.put("time", time);
					fileter.put("key", "'DefrosingTime'");
					for (HashMap<String, String> blowerinf : blowerList) {
						String blids = blowerinf.get("ids");
						String blfrostPowers = blowerinf.get("frostPowers");
						tempMap = getValueMap(blids, blfrostPowers);
						fileter.put("oid", blids);
						List<ColdStorageAnalysisEntity> blowersisdata = storageAnalysisMapper .findValueByFilter(fileter);
						if (SetUtil.isnotNullList(blowersisdata)) {
							for (ColdStorageAnalysisEntity clsis : blowersisdata) {
								double qfrost = tempMap.get(clsis.getOid()) * clsis.getValue();
								sis = new ColdStorageAnalysisEntity(4, clsis.getOid(), "Qblower", qfrost, dateTime);
								sisList.add(sis);
							}
						} 
					}
					if(SetUtil.isnotNullList(sisList)){
						this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
	}

	/**
	 * 3 Q叉=Σ（P叉*t叉累积）
	 */
	private void setQForklift(String time, Date dateTime,String startTime,String endTime) { //为机群服务器队列任务做准备
			try {
				ColdStorageAnalysisEntity sis = null;
				List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
				List<HashMap<String, String>> forkliftsetList = this.quantitySetMapper .getCountforkliftset("forkliftset");
				if (SetUtil.isnotNullList(forkliftsetList)) {
					for (HashMap<String, String> forklifsetinfo : forkliftsetList) {
						String oid = forklifsetinfo.get("ids");
						String power = forklifsetinfo.get("powers");
						HashMap<Integer, Double> tempMap =this.getValueMap(oid, power);
						List<ForkLiftEntity> forkLiftList = this.quantityMapper .findForkliftByTime(oid, startTime,endTime);
						if (SetUtil.isnotNullList(forkLiftList)) {
							for (ForkLiftEntity forkLift : forkLiftList) {
								sis = new ColdStorageAnalysisEntity(4, forkLift.getOid(), "QForklift", forkLift.getValue()*tempMap.get(forkLift.getOid()), dateTime);
								sisList.add(sis);
							}
						}
					}
					if(SetUtil.isnotNullList(sisList)){
						this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

	}

	/**
	 * 4 Q照=Σ（P照*t照累积）
	 */
	private void setQlighting(String time, Date dateTime,String startTime,String endTime) {
		try {
			ColdStorageAnalysisEntity sis = null;
			List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
			List<HashMap<String, String>> forkliftsetList = this.quantitySetMapper.getCountforkliftset("coldstoragelightset");
			if (SetUtil.isnotNullList(forkliftsetList)) {
				for (HashMap<String, String> forklifsetinfo : forkliftsetList) {
					String oid = forklifsetinfo.get("ids");
					String power = forklifsetinfo.get("powers");
					HashMap<Integer, Double> tempMap =this.getValueMap(oid, power);
					// this.quantityMapper .findForkliftByTime(oid, startTime,endTime);
					
				}
				if(SetUtil.isnotNullList(sisList)){
					this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 6 Q风=Σ（P风*t风累积）
	 */
	private void setQblower(String time) {
		try {
			ColdStorageAnalysisEntity sis = null;
			HashMap<Integer, Double> tempMap = null;
			List<ColdStorageAnalysisEntity> sisList = new ArrayList<ColdStorageAnalysisEntity>();
			List<HashMap<String, String>> blowerList = this.quantitySetMapper.findFanPower(null);// 按冷库分组查询
			if (SetUtil.isnotNullList(blowerList)) {
				HashMap<String, Object> fileter = new HashMap<String, Object>();
				fileter.put("type", 4);
				fileter.put("time", time);
//				fileter.put("key", "'DefrosingTime'");
//				for (HashMap<String, String> blowerinf : blowerList) {
//					String blids = blowerinf.get("ids");
//					String blfrostPowers = blowerinf.get("fanPowers");
//					tempMap = getValueMap(blids, blfrostPowers);
//					fileter.put("oid", blids);
//					List<ColdStorageAnalysisEntity> blowersisdata = storageAnalysisMapper .findValueByFilter(fileter);
//					if (SetUtil.isnotNullList(blowersisdata)) {
//						for (ColdStorageAnalysisEntity clsis : blowersisdata) {
//							double qfrost = tempMap.get(clsis.getOid()) * clsis.getValue();
//							sis = new ColdStorageAnalysisEntity(4, clsis.getOid(), "Qblower", qfrost, dateTime);
//							sisList.add(sis);
//						}
//					} 
//				}
				if(SetUtil.isnotNullList(sisList)){
					this.storageAnalysisMapper.addColdStorageAnalysis(sisList);//批處理
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 7 Q门=0.675*(Wq*Lq*Hq）*n*（Hw-Hn）
	 * Q门=0.675*(Wq*Lq*Hq）*n*（Hw-Hn）
	 */
	private void setQctdoor(String time) {

	}

	
	
	
}
