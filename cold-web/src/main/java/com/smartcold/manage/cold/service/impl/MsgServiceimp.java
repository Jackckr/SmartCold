package com.smartcold.manage.cold.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.smartcold.manage.cold.dao.newdb.ColdStorageAnalysisMapper;
import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.PowerSetMapping;
import com.smartcold.manage.cold.dao.olddb.QuantitySetMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.WarningsLog;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.Rdc;
import com.smartcold.manage.cold.entity.olddb.SystemInformEntity;
import com.smartcold.manage.cold.service.MsgService;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.ExportExcelUtil;
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
	private MessageMapper msMappergMapper;
	@Autowired
	private ColdStorageSetMapper coldStorageSetMapper;
	@Autowired
	private PowerSetMapping powerSetMapping;
	@Autowired
	private StorageService storageService;
//	@Autowired
//	private WarningsInfoMapper warningsInfoMapper;
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
	    if(!taskStatus){return ;}
		this.getERRinfo();
	}

     /**
 	 * 半小时执行一次
 	 * Task:检查AP
 	 * 超过系统规定时间 ，发送短信通知。。
 	 * 
 	 */
	@Scheduled(cron = "0 0/30 * * * ?")
	public void checkAPStatus() {
		boolean taskStatus = quantityMapper.updateTaskStatus(2);
		if(!taskStatus){return ;}
		long currentTime = System.currentTimeMillis() - 1800000;
		Date startTime = new Date(currentTime);
		Date endTime = new Date();
		List<Rdc> rdcList = this.rdcMapper.getDEVRdc(false);
		if (SetUtil.isnotNullList(rdcList)) {
			for (Rdc rdc : rdcList) {
		      this.sendMsg(rdc,  startTime, endTime);	
			}
		}
		
	}
	
	/**
	 * 每天凌晨1:30点触发
	 * Task:刪除临时任务
	 * 重置dev
	 */
	@Scheduled(cron = "0 30 1 * * ?")
	public void delTempTask() {
		ExportExcelUtil.clearTask();        
		boolean taskStatus = quantityMapper.updateTaskStatus(4);
		if(!taskStatus){return ;}
		this.delTempfile();
    	this.resetDevStatus();
    	this.LowbatteryAlarm();
	}
	

	
	/**
	 * 每天凌晨3:30点触发
	 * Task:计算热量
	 */
	@Scheduled(cron = "0 30 3 * * ?")
	public void reckonQuantity() {
	    boolean taskStatus = quantityMapper.updateTaskStatus(3);
		if(!taskStatus){return ;}
		String time = TimeUtil.getFormatDate(TimeUtil.getBeforeDay(1));
		Date dateTime = TimeUtil.parseYMD(time);
		String startTime= time+ " 00:00:00";String endtime =time+ " 23:59:59";
	    this.setQFrost(time,dateTime); //2 Q霜
	    this.setQblower(time, dateTime);//6 Q风
		this.setQForklift(time,dateTime,startTime,endtime);//3 Q叉,4 Q照
		this.setQctdoor(time, dateTime, startTime, endtime);//Q門
	}
  
	
	/**
	 * 删除临时目录
	 */
	private void delTempfile(){
		try {
			this.quantityMapper.delTempTask();//添加临时任务
			String path=this.getClass().getResource("").getPath();
			path= path.substring(0, path.indexOf("WEB-INF"));
  	        File file=new File(path+File.separator+"Temp");
			this.deleteFile(file);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	/**
	 * 重置DEV
	 */
	private void resetDevStatus(){
        try {
			HashMap<String, Object> filter  = new HashMap<String, Object>();
			filter.put("status", 0);filter.put("type", 18);// 仅检查温度
			List<DeviceObjectMappingEntity> devciceList = this.deviceMapper.findInfoByfilter(filter);
			if(SetUtil.isnotNullList(devciceList)){
				Date endTime = new Date();Date startTime = TimeUtil.getBeforeMinute(30);
				StringBuffer devmapid=new StringBuffer();
				StringBuffer devid=new StringBuffer();
				for (DeviceObjectMappingEntity obj : devciceList) {
					Integer size = this.storageService .findCounSizeByTime(obj.getType(), obj.getOid(), obj.getDeviceid(), "Temp", startTime, endTime);//keyval.get(obj.getType())
					if(size>0){devmapid.append(obj.getId()+",");devid.append(obj.getDeviceid()+",");}
				}
				if(devmapid.length()>0){
					this.deviceMapper.resetDevByID(devmapid.substring(0, devmapid.length()-1));
					String msg= "系统在"+TimeUtil.getDateTime()+"自动重置{"+devid.subSequence(0, devid.length()-1)+"}设备！";
					this.msMappergMapper.addsystemInform(new SystemInformEntity(1,2, null, null, 0, 0, 0,"DEV自动重置",msg));//添加至系统通知
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//低电量 
	private void LowbatteryAlarm(){
        try {
			List<HashMap<String, Object>> lowPower = this.deviceMapper.getLowPower(TimeUtil.getDateTime(TimeUtil.getBeforeHOUR(12)));
			if(SetUtil.isnotNullList(lowPower)){
				StringBuffer msg=new StringBuffer("以下设备电压低于标准工作电压,请及时检查！");
				for (HashMap<String, Object> hashMap : lowPower) {
					msg.append("设备:"+hashMap.get("deviceid")+"电压:"+hashMap.get("value")+",/r/n");
				}
					msg.delete(msg.length()-5,msg.length());
				this.msMappergMapper.addsystemInform(new SystemInformEntity(1,2, null, null, 0, 0, 0,"DEV低电量告警",msg.toString()));//添加至系统通知
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 删除文件夹
	 * @param file
	 */
	private void deleteFile(File file) {
		if (file.exists()) {// 判断文件是否存在
			if (file.isFile()) {// 判断是否是文件
				file.delete();// 删除文件
			} else if (file.isDirectory()) {// 否则如果它是一个目录
				File[] files = file.listFiles();// 声明目录下所有的文件 files[];
				for (int i = 0; i < files.length; i++) {// 遍历目录下所有的文件
					this.deleteFile(files[i]);// 把每个文件用这个方法进行迭代
				}
				file.delete();// 删除文件夹
			}
		} else {
			System.out.println("所删除的文件不存在");
		}
	}
    
	private void sendMsg(Rdc rdc,Date startTime,Date endTime) {
		int rdcid=rdc.getId();
		String rdcName=rdc.getName();
		//开始逻辑
		HashMap<String, Object> filter  = new HashMap<String, Object>();
		filter.put("status", 1);// 检查正常的devcice是否正常工作
		filter.put("type", 18);// 仅检查温度,
		filter.put("rdcid",rdcid);
		List<DeviceObjectMappingEntity> devciceList = this.deviceMapper.findInfoByfilter(filter);
		HashMap<Integer, String> coldNameMap=new HashMap<Integer, String>();//冷库信息
		for (DeviceObjectMappingEntity obj : devciceList) {
			Integer size = this.storageService .findCounSizeByTime(obj.getType(), obj.getOid(), obj.getDeviceid(), "Temp", startTime, endTime);//keyval.get(obj.getType())
			if (size == null || size == 0) {
				ColdStorageSetEntity storageSetEntity = this.coldStorageSetMapper.findByTID(obj.getOid());
				if(coldNameMap.containsKey(storageSetEntity.getId())){//存在报警
					coldNameMap.put(storageSetEntity.getId(), coldNameMap.get(storageSetEntity.getId())+","+obj.getDeviceid())	;
				}else{
					coldNameMap.put(storageSetEntity.getId(), storageSetEntity.getName()+"-"+obj.getDeviceid());
				}
        	}
        }
		if(coldNameMap.size()>0){
			StringBuffer msg =new StringBuffer( "【Warning】{RDC=" + rdcName+ "}");
			String rdctype="";String deviceid="";
			for (int id : coldNameMap.keySet()) {
				String[] split = coldNameMap.get(id).split("-");
				msg.append("{"+split[0]+"}{Dev="+split[1]+"}");
				rdctype=split[0]+",";deviceid+=split[1]+",";
			}
			msg.deleteCharAt(msg.length() - 1);
			msg.append("已经超过30分钟未上报数据，请注意检查!");
			HashMap<String, Object>	updata = new HashMap<String, Object>();
			
			this.msMappergMapper.addsystemInform(new SystemInformEntity(2, 1, rdcid, null, 3, 0, 0, "DEV断线告警",msg.toString()));//添加至系统通知
		    updata.clear();
			updata.put("rdcid", rdcid);//
			updata.put("status", 0);
			updata.put("deviceids",  deviceid.substring(0, deviceid.length()-1));
			this.deviceMapper.upDeviceObjectStatus(updata);//
			String tel= this.rdcMapper.findRdcManger(rdcid);
			if(StringUtil.isnotNull(tel)){
					updata.put("rdc", "\nRDC={" + rdcName + "}");
					updata.put("rdctype","deviceidtype={" +rdctype.substring(0, rdctype.length()-1) + "}");
					updata.put("dev", "deviceid={"        + deviceid.substring(0, deviceid.length()-1)+ "}");
					updata.put("telephone", tel);
//					RemoteUtil.httpPost("http://liankur.com/i/warning/warningTele",updata);
			}
		}
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
            	this.setQblower(time, dateTime);//6 Q风
            	this.setQForklift(time,dateTime,startTime,endtime);//3 Q叉,4 Q照
            	this.setQctdoor(time, dateTime, startTime, endtime);//Q門
        	}
		}
    }
	
	
	
	/**
	 * 检查数据是否正常
	 * @param startTime
	 */
	public void getERRinfo(){
		Date startMTime = TimeUtil.getBeforeMinute(5);//
//   	try {   this.warningLogMapper.addWREerrByTime( startTime);      } catch (Exception e) { e.printStackTrace(); }
		try { 	this.warningLogMapper.addSUerrByTime( startMTime);       } catch (Exception e) { e.printStackTrace(); }  //DEV->U 
		try { 	this.warningLogMapper.addSIerrByTime( startMTime);       } catch (Exception e) { e.printStackTrace(); }  //DEV->I
		try { 	this.warningLogMapper.addHTCLogbyTime( startMTime);      } catch (Exception e) { e.printStackTrace(); }   //dev->TEMP	
		
//		try { 	this.warningLogMapper.addscollPUerrByTime( startTime);  } catch (Exception e) { e.printStackTrace(); }  //PLC->U
//		try { 	this.warningLogMapper.addscollPIerrByTime( startTime);  } catch (Exception e) { e.printStackTrace(); }   //PLC->I	
//		try { 	this.warningLogMapper.addwaringLogbyTime(startTime);    } catch (Exception e) { e.printStackTrace(); }  //PLC->TEMP	
		try { 	this.chdoorstatus();  } catch (Exception e) { e.printStackTrace(); }  //DEV -SWith门常开报警
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
	 *   1. select coldStorageId,group_concat(`id`) ids ,group_concat(`frostPower`) frostPowers  from blowerset where  `frostPower` >0   GROUP BY `coldStorageId`
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
						List<ColdStorageAnalysisEntity> blowersisdata = storageAnalysisMapper.findValueByFilter(fileter);
						if (SetUtil.isnotNullList(blowersisdata)) {
							double qfrost=0;
							for (ColdStorageAnalysisEntity clsis : blowersisdata) {
								 qfrost+= tempMap.get(clsis.getOid()) * clsis.getValue();
							}
							sisList.add(new ColdStorageAnalysisEntity(1, coldStorageId, "QFrost", qfrost/3600, dateTime));
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
	 * 1.select coldStorageId,group_concat(`id`) ids ,group_concat(`fanPower`) fanPowers  from `smartcold`.blowerset where  `fanPower` >0 GROUP BY `coldStorageId`; 计算平均功率
	 * 2. select * from `coldstorageanalysis` where 1=1 AND `type` = 4 AND `key`in ('RunningTime') AND `oid` in (26,28)   AND `date` BETWEEN '2016-10-17 00:00:00'  and '2016-10-17 23:59:59'  order by `date`,`oid` ;
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
				fileter.put("key", "'RunningTime'");
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
						sisList.add(new ColdStorageAnalysisEntity(1, coldStorageId, "Qblower", qfrost/3600, dateTime));
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
	 * 2.SELECT  rdcid, group_concat(id) ids ,group_concat(power) powers ,sum(power)/COUNT(*) avgpower  FROM `forkliftset` where `power` >0 and rdcid in(1590) GROUP BY rdcid; ; 计算平均功率
	 *   SELECT  rdcid, group_concat(id) ids ,group_concat(power) powers ,sum(power)/COUNT(*) avgpower  FROM `coldstoragelightset` where `power` >0 and rdcid in(1590) GROUP BY rdcid; ; 计算平均功率
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
							    	List<HashMap<String, Object>> lightsetList = this.quantitySetMapper.getLightPowerByCoid(coldstorageid);//获得照明功率
							    	List<HashMap<String, Object>> forkliftsetList = this.quantitySetMapper.getPowerGroupByRDC("forkliftset", rdcid);//获得叉车功率
							    	if(SetUtil.isnotNullList(forkliftsetList)){
							    		avgforkliftPower =(Double) forkliftsetList.get(0).get("avgpower");
							    	}
							    	if(SetUtil.isnotNullList(lightsetList)){
							    		avglightsetPower =(Double) lightsetList.get(0).get("sumpower");
							    	}
							    	for (ColdStorageAnalysisEntity clsis : doorTotalTime) {
							    		if(avgforkliftPower!=0){
							    			sumForklift+=avgforkliftPower * clsis.getValue();
							    		}
							    		if(avglightsetPower!=0){
							    			sumlighting+=avglightsetPower * clsis.getValue();
							    		}
									 }
							    	if(sumForklift!=0){
							    	  sisList.add(new ColdStorageAnalysisEntity(1,coldstorageid, "QForklift", sumForklift/3600, dateTime));
							    	}
							    	if(sumlighting!=0){
							    		sisList.add(new ColdStorageAnalysisEntity(1,coldstorageid, "Qlighting", sumlighting/3600, dateTime));
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
			List<HashMap<String, Object>> coldstoragesetList = this.quantitySetMapper.getColdstorageseting();
			if (SetUtil.isnotNullList(coldstoragesetList)) {
				for (HashMap<String, Object> hashMap : coldstoragesetList) {
						    int id = (Integer) hashMap.get("id");//coldstorageset->id
						    Double  hw = this.quantitySetMapper.getHNbyOid(hashMap.get("refoid"), hashMap.get("outhumidity"),hashMap.get("outtempe"));
						    if(hw==null){continue;}
						    Double  hn = this.quantitySetMapper.getHNbyOid(id, hashMap.get("inhumidity"),null);
						    if(hn==null){continue;}
						    Double cgvolume=(Double) hashMap.get("cgvolume");//冷库面积d
						    Double  vvalue = this.quantitySetMapper.getventilationSet(cgvolume);//换气次数d
						    if(vvalue==null){continue;}
						    Double Q=0.675*cgvolume*vvalue*(hw-hn)/3600;//临时值
						    sisList.add(new ColdStorageAnalysisEntity(1, id, "Qctdoor", Q, dateTime));
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
	
    /**
     * 门报警
     */
	private void chdoorstatus( ){
		List<DeviceObjectMappingEntity> doorDevMapper = this.quantityMapper.getDoorDevMapper();
		if(SetUtil.isnotNullList(doorDevMapper)){
			HashMap<Integer, String>  rdcdoorinfo=new HashMap<Integer, String>();
			for (DeviceObjectMappingEntity obj : doorDevMapper) {
				int overtempdelay=60;//默认60分钟
				if(obj.getStatus()>0){overtempdelay=(int) obj.getStatus();}
				Date stTime = TimeUtil.getBeforeMinute(overtempdelay);
				Double sumcount = this.quantityMapper.getSwitchTime(obj.getDeviceid(), TimeUtil.getFormatDate(stTime), null);
				Double opencount = this.quantityMapper.getSwitchTime(obj.getDeviceid(), TimeUtil.getFormatDate(stTime), 1);
				if(sumcount!=null&&opencount!=null&&sumcount==opencount){//表示持续开门将报警
					if(rdcdoorinfo.containsKey(obj.getRdcid())){
						rdcdoorinfo.put(obj.getRdcid(), rdcdoorinfo.get(obj.getRdcid())+","+obj.getName());
					}else{
						rdcdoorinfo.put(obj.getRdcid(),obj.getName());
					}
				}
			}
			if(SetUtil.isNotNullMap(rdcdoorinfo)){
				List<WarningsLog> errInfoList=new ArrayList<WarningsLog>();
				for (Integer rdcid: rdcdoorinfo.keySet()) {
					rdcdoorinfo.put(rdcid, "{"+rdcdoorinfo.get(rdcid)+"}门超时未关闭");
				}
				this.warningLogMapper.addWarningLog(errInfoList);
			 }
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
	
	
	
}
