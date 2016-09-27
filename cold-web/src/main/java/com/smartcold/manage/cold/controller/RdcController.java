package com.smartcold.manage.cold.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.olddb.WarningMsgEntity;
import com.smartcold.manage.cold.service.RdcService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-04-29 00:12)
 */
@Controller
@RequestMapping(value = "/rdc")
public class RdcController {

	@Autowired
	private RdcMapper rdcMapper;

	@Autowired
	private RdcService rdcService;
	@Autowired
	private StorageService storageService;
	@Autowired
	private MessageMapper megMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceMapper;
	
	@RequestMapping(value = "/findRdcList", method = RequestMethod.GET)
	@ResponseBody
	public Object findRdcList() {
		return rdcMapper.findRdcList();
	}

	@RequestMapping(value = "/findRDCByRDCId", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCByRDCId(@RequestParam int rdcID) {
		return rdcMapper.findRDCByRDCId(rdcID);
	}

	@RequestMapping(value = "/searchRdc", method = RequestMethod.GET)
	@ResponseBody
	public Object searchRdc(String filter) {
		// HashMap<String, List<Rdc>> result = new HashMap<String, List<Rdc>>();
		// result.put("results", rdcMapper.searchRdc("%" + filter + "%"));
		return rdcMapper.searchRdc("%" + filter + "%");
	}

	@RequestMapping(value = "/findRDCsByUserid", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCsByUserid(@RequestParam int userid) {
		return rdcService.findRdcsByUserId(userid);
	}

	@RequestMapping(value = "/findRDCByUserid", method = RequestMethod.GET)
	@ResponseBody
	public Object findRDCByUserid(@RequestParam int userid) {
		return rdcService.findRdcByUserid(userid);
	}
	
	@RequestMapping(value = "/checkAPStatus", method = RequestMethod.GET)
	public ResponseData<String> checkAPStatus() {
		System.err.println(TimeUtil.getDateTime()+"*************时间到了。。。我要开始工作了");
		List<Map<String, Object>> findRdcManger = this.rdcMapper.findRdcManger();//查找监听保护对象
		Map<Integer,String> telMap=new HashMap<Integer, String>();
		if(SetUtil.isnotNullList(findRdcManger)){
			HashMap<String, Object> filter=new HashMap<String, Object>();
		    String rdcidlist="";
			for (Map<String, Object> map : findRdcManger) {
				int rdcid =(Integer) map.get("rdcid"); 
				rdcidlist+=rdcid+",";
				telMap.put(rdcid, map.get("telephone").toString());
			}
			filter.put("status",1);//检查正常的devcice是否正常工作
			filter.put("rdcid",rdcidlist.substring(0, rdcidlist.length()-1));
			List<DeviceObjectMappingEntity> devciceList = this.deviceMapper.findInfoByfilter(filter);
			return this.sendMsg(devciceList,telMap);
		}else{
			return ResponseData.newSuccess("没有配置保护对象");
		}
	}
	/**
	 * 定义消息组件
	 * @param devciceList
	 * @param telMap
	 */
	private ResponseData<String> sendMsg(List<DeviceObjectMappingEntity> devciceList,Map<Integer,String> telMap ){
		
		long currentTime = System.currentTimeMillis() +1800000;
		Date startTime = new Date();
		Date endTime = new Date(currentTime);
		if(SetUtil.isnotNullList(devciceList)){
			Map<String, Object> resMap=null;
			LinkedHashMap<Integer, Map<String, Object>> tempData=new LinkedHashMap<Integer, Map<String, Object>>();
			for (DeviceObjectMappingEntity obj : devciceList) {
				resMap=new HashMap<String, Object>();
				Integer size=storageService.findCounSizeByTime(obj.getType(), obj.getOid(), obj.getDeviceid(),"", startTime, endTime);
				if(size!=null&&size==0){
						if(tempData.containsKey(obj.getRdcid())){
							resMap = tempData.get(obj.getRdcid());
							resMap.put("deviceid",resMap.get("deviceid")+","+obj.getDeviceid()); 
						}else{
							resMap.put("rdcname", this.rdcMapper.selectByPrimaryKey(obj.getRdcid()).getName());
							resMap.put("deviceid", obj.getDeviceid());
						}
						tempData.put(obj.getRdcid(), resMap);
				}
			}
			if(tempData.size()>0){
			  System.out.println("==========================================开始发送短信通知=========================");	
			  String runmsg="";
			  WarningMsgEntity info=null;
			  HashMap<String, Object> updata=null;
			  for (int rdcid : tempData.keySet()) {
				  Map<String, Object> map = tempData.get(rdcid);
				  String tels = telMap.get(rdcid);
				  System.out.println("向"+tels+"发送通知信息:");
				  String msg="【Warning】{RDC="+map.get("rdcname")+"}{Dev="+map.get("deviceid")+"}已经超过30分钟未上报数据，请注意检查";
				  System.out.println(msg);
				  info=new WarningMsgEntity(rdcid,0,"告警通知",tels,msg);
				  this.megMapper.addwarningmessage(info);
				  updata=new HashMap<String, Object>();
				  updata.put("rdcid", rdcid);//  update deviceobjectmapping set `status`=#{status} where rdcid=#{rdcid} and deviceid in(${deviceids});
				  updata.put("status", 0);
				  updata.put("deviceids", map.get("deviceid"));
				  runmsg+=msg;
				  this.deviceMapper.upDeviceObjectStatus(updata);
				  updata.remove("status");
				  updata.put("rdcname", map.get("rdcname"));
//				  RemoteUtil.httpPost("http://1920.68.1.", updata);
			  }
			  System.err.println("==========================================开始发送短信通知=========================");	
			   return ResponseData.newFailure("数据异常！"+runmsg);
			}else{
			  return ResponseData.newSuccess("数据正常！");
			}
		}else{
			return ResponseData.newFailure("没有可用Device设备！请重置设备！");
		}
	}
}
