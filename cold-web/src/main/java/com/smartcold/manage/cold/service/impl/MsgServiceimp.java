package com.smartcold.manage.cold.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.olddb.WarningMsgEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.MsgService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.SetUtil;

/**
 * Copyright (C) DCIS 版权所有 功能描述: MsgServiceimp Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class MsgServiceimp implements MsgService {

	@Autowired
	private RdcMapper rdcMapper;
	@Autowired
	private StorageService storageService;

	@Autowired
	private MessageMapper megMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceMapper;

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
						String msg = "【Warning】{RDC=" + map.get("rdcname") + "}{" + map.get("devicetype") + "}{Dev="
								+ map.get("deviceid") + "}已经超过30分钟未上报数据，请注意检查";
						info = new WarningMsgEntity(rdcid, 0, "告警通知", tels, msg);
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

}
