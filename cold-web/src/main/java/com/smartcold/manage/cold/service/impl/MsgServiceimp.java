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
import com.smartcold.manage.cold.dao.newdb.PowerMapper;
import com.smartcold.manage.cold.dao.newdb.WarningsInfoMapper;
import com.smartcold.manage.cold.dao.olddb.BlowerSetMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.PowerSetMapping;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.PowerEntity;
import com.smartcold.manage.cold.entity.newdb.WarningsInfo;
import com.smartcold.manage.cold.entity.olddb.BlowerSetEntity;
import com.smartcold.manage.cold.entity.olddb.PowerSetEntity;
import com.smartcold.manage.cold.entity.olddb.WarningMsgEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.MsgService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.SetUtil;
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
	private PowerSetMapping powerSetMapping;
	@Autowired
	private StorageService storageService;
	@Autowired
	private WarningsInfoMapper warningsInfoMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceMapper;
	
	/**
	 * 计算Q
	 */
	@Autowired
	private BlowerSetMapper blowerSetMapper;
	@Autowired
	private ColdStorageAnalysisMapper  sisMapper;
	/**
	 * stupe 1.检查哪些库进行关联配置 2.将配置对象放进线程池进行监听保护 StorageService-》findByTime
	 * 3.超过系统规定时间 ，发送短信通知。。
	 * 
	 */
	@Scheduled(cron = "0 0/30 * * * ?")
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
				Integer size = storageService.findCounSizeByTime(obj.getType(), obj.getOid(), obj.getDeviceid(), "",
						startTime, endTime);
				if (size != null && size == 0) {
					String oidname = "";
					List<HashMap<String, Object>> oidobj = this.megMapper
							.findObjsetByOid(StorageType.getStorageType(obj.getType()).getTable(), obj.getOid());
					if (SetUtil.isnotNullList(oidobj)) {
						oidname = (String) oidobj.get(0).get("name");
					}
					if (tempData.containsKey(obj.getRdcid())) {
						resMap = tempData.get(obj.getRdcid());
						resMap.put("devicetype", resMap.get("devicetype") + "," + oidname);
						resMap.put("deviceid", resMap.get("deviceid") + "," + obj.getDeviceid());
					} else {
						resMap.put("rdcname", this.rdcMapper.selectByPrimaryKey(obj.getRdcid()).getName());
						resMap.put("deviceid", obj.getDeviceid());
						resMap.put("devicetype", oidname);
					}
					tempData.put(obj.getRdcid(), resMap);
				}
			}
			if (tempData.size() > 0) {
				try {
					WarningMsgEntity info = null;
					HashMap<String, Object> updata = null;
					for (int rdcid : tempData.keySet()) {
						Map<String, Object> map = tempData.get(rdcid);
						String tels = telMap.get(rdcid);
						String msg = "【Warning】{RDC=" + map.get("rdcname") + "}{" + map.get("devicetype") + "}{Dev="+ map.get("deviceid") + "}已经超过30分钟未上报数据，请注意检查";
						info = new WarningMsgEntity( 0,rdcid, "告警通知", tels, msg);
						this.megMapper.addwarningmessage(info);
						updata = new HashMap<String, Object>();
						updata.put("rdcid", rdcid);//
						updata.put("status", 0);
						updata.put("deviceids", map.get("deviceid"));
						this.deviceMapper.upDeviceObjectStatus(updata);
						updata.clear();
						updata.put("rdc", "\nRDC={" + map.get("rdcname") + "}");
						updata.put("rdctype", "deviceidtyoe={" + map.get("devicetype") + "}");
						updata.put("dev", "deviceid={" + map.get("deviceid") + "}");
						updata.put("telephone", tels);
						RemoteUtil.httpPost("http://liankur.com/i/warning/warningTele", updata);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	
	
	/**
	 * 检查数据是否执行报警
	 */
	@Scheduled(cron = "0 0/5 * * * ?")
	public void checkData(){
		System.err.println("开始工作。。。。。。。");
		WarningsInfo waInfo=null;
		List<WarningsInfo> errInfoList=new ArrayList<WarningsInfo>();
		Date startTime = TimeUtil.getBeforeMinute(5);//
		System.err.println("查询时间"+TimeUtil.getDateTime(startTime));
		List<WarningsInfo> fErrWarningList = this.warningsInfoMapper.findErrWarningByTime(startTime);//PLC报警
		if(SetUtil.isnotNullList(fErrWarningList)){//
			errInfoList.addAll(errInfoList);
		}
		List<PowerEntity> ublowerlist = this.powerMapper.findUBlowerByTime(startTime);//电压缺相报警-
		if(SetUtil.isnotNullList(ublowerlist)){
			List<Integer> poweid=new ArrayList<Integer>();
			for (PowerEntity pow : ublowerlist) {poweid.add(pow.getId());}
			String powids = poweid.toString();
			powids=powids.substring(1, powids.length()-1);
			List<PowerSetEntity> powerSetList = this.powerSetMapping.findByFilter(null,powids);
			HashMap<Integer, PowerSetEntity> powerSetMap=new HashMap<Integer, PowerSetEntity>();
			if(SetUtil.isnotNullList(powerSetList)){
				for (PowerSetEntity powerSet : powerSetList) {
					powerSetMap.put(powerSet.getId(), powerSet);
				}
			}
			for (PowerEntity power : ublowerlist) {
				waInfo=new WarningsInfo();
				PowerSetEntity powerSetEntity = powerSetMap.get(power.getOid());
				if(powerSetEntity!=null){
					waInfo.setRdcId(powerSetEntity.getRdcid());
					waInfo.setWarningname(powerSetEntity.getName()+power.getKey()+"相电压缺相");
					errInfoList.add(waInfo);
				}
			}
		}
		List<PowerSetEntity> powerSetList = this.powerSetMapping.findByFilter(0,null);//检查有配置的电表电流->需多线程处理
		if(SetUtil.isnotNullList(powerSetList)){
			for (PowerSetEntity powerSetEntity : powerSetList) {
				List<PowerEntity> iBlowerList = this.powerMapper.findIBlowerByTime(powerSetEntity.getId(),powerSetEntity.getIunbalance(),startTime);//电流异常报警
				if(SetUtil.isnotNullList(iBlowerList)){
					for (PowerEntity power : iBlowerList) {
						waInfo=new WarningsInfo();
						waInfo.setRdcId(powerSetEntity.getRdcid());
						waInfo.setWarningname(powerSetEntity.getName()+power.getKey()+"电流不平衡");
						errInfoList.add(waInfo);
					}
				}
			}
			
		}	
		
		//溫度報警
		
		
		
		
	}
	
	/**
	 * 计算热量
	 * 每天凌晨两点触发 
	 */
//	@Scheduled(cron = "0 15 02 * * ?")
	public void reckonQuantity(){
//		List<BlowerSetEntity> findByFilter = this.blowerSetMapper.findByFilter(null, null, new Double(0));//Q风	
//		
		
//		this.sisMapper.findValueByFilter(filter)
		
		
		
		
	}
	
	public static void main(String[] args) {
		
	}
}
