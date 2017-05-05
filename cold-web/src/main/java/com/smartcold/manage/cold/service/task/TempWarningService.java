package com.smartcold.manage.cold.service.task;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.omg.PortableServer.ID_ASSIGNMENT_POLICY_ID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.ColdStorageAnalysisMapper;
import com.smartcold.manage.cold.dao.newdb.DevStatusMapper;
import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.QuantityMapper;
import com.smartcold.manage.cold.dao.newdb.TaskMapper;
import com.smartcold.manage.cold.dao.newdb.TempWarningMapper;
import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.dao.olddb.QuantitySetMapper;
import com.smartcold.manage.cold.dao.olddb.RdcMapper;
import com.smartcold.manage.cold.dao.olddb.TempSetMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.olddb.Rdc;
import com.smartcold.manage.cold.entity.olddb.TempSetEntity;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 温度告警
 * Copyright (C) DCIS 版权所有 功能描述: TempWarningService Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class TempWarningService  {
	
	
	@Autowired
	private RdcMapper rdcMapper;
	@Autowired
    private TaskMapper  taskMapper;
	@Autowired
	private StorageService storageService;
	@Autowired
	private ColdStorageSetMapper coldStorageSetMapper;
	@Autowired
	private TempSetMapper tempSetMapper;
	@Autowired
	private TempWarningMapper tempWarningMapper;
	@Autowired
	private DevStatusMapper devStatusMapper;
	
	@Autowired
	private WarningLogMapper warningLogMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceMapper;

	/**
	 * 计算Q
	 */
	@Autowired
	private QuantityMapper quantityMapper;
	@Autowired
	private QuantitySetMapper quantitySetMapper;
	
	private static HashMap<Integer,Integer > cach=new HashMap<Integer,Integer>();
	/**
	 * 每四小时 执行一次 缓存10分钟 
	 *  
	 */
    @Scheduled(cron="0 10 */4 * * ?")
	public void checkData() {
		
    	String startTime =TimeUtil.getDateTime( TimeUtil.getBeforeHOUR(4));
    	List<Rdc> rdcList = this.rdcMapper.getDEVRdc(true); //dev
		if (SetUtil.isnotNullList(rdcList)) {
			for (Rdc rdc : rdcList) {
		      List<ColdStorageSetEntity> coldStorageList = this.coldStorageSetMapper.findByRdcId(rdc.getId());
		      if(SetUtil.isnotNullList(coldStorageList)){
		    	  for (ColdStorageSetEntity coldStorageSetEntity : coldStorageList) {
		    		  List<TempSetEntity> tempsetBycoldstorageid = this.tempSetMapper.getTempsetBycoldstorageid(coldStorageSetEntity.getId());
		    		  if(SetUtil.isnotNullList(tempsetBycoldstorageid))  {
		    			  for (TempSetEntity tempSetEntity : tempsetBycoldstorageid) {
						  	List<DeviceObjectMappingEntity> devmappList = this.deviceMapper.findByTypeOid(18, tempSetEntity.getId());
						  	if(SetUtil.isnotNullList(devmappList)){
						  		if (coldStorageSetEntity.getTempdiff()>0) {
						  			float poor=	coldStorageSetEntity.getTempdiff()/2;
						  			float startTempe= coldStorageSetEntity.getStartTemperature();
						  			float minvalue=poor+startTempe;
						  			float maxvalue=poor+startTempe+2;
						  			Integer pl=devStatusMapper.getPLByDEVName(devmappList.get(0).getDeviceid(), 2);if(pl==null){pl=30;}//获得采集频率
//							  		List<StorageKeyValue> overValueByDevId = this.tempWarningMapper.getOverValueByDevId(devmappList.get(0).getDeviceid(), minvalue, maxvalue, startTime);
							  		
							  		
							  		
								}
						  	}
						  }
		    		  }
				   }
		      }
			}
		}
	}
    
    /**
	 * 	半个小时检查超温
	 *  L1:+2 每进入一个异常数据加入检测范围
	 *  L2:+4  
	 *  L3:+6 
	 *  L4:+8 ->极限温度
	 * 
	 * 
	 */
	@Scheduled(cron = "0 0/30 * * * ?")
	public void getHighTemp() {
    	String startTime =TimeUtil.getDateTime( TimeUtil.getBeforeMinute(30));
    	this.checkoverTemp(10, startTime);
	}
    
    
    /**
     * 每月最后一天的23点55分触发
     * 做月度报表
     */
    @Scheduled(cron="0 55 23 L * ?")
   	public void checkDat2a() {
    
    
    }

    
    /**
     * jia
     * @param difference
     */
    private void checkoverTemp(int level,String startTime){
    	List<Rdc> rdcList = this.rdcMapper.getDEVRdc(true); //dev
		if (SetUtil.isnotNullList(rdcList)) {
			for (Rdc rdc : rdcList) {
		      List<ColdStorageSetEntity> coldStorageList = this.coldStorageSetMapper.findByRdcId(rdc.getId());
		      if(SetUtil.isnotNullList(coldStorageList)){
		    	  for (ColdStorageSetEntity coldStorageSetEntity : coldStorageList) {
		    		  List<TempSetEntity> tempsetBycoldstorageid = this.tempSetMapper.getTempsetBycoldstorageid(coldStorageSetEntity.getId());
		    		  if(SetUtil.isnotNullList(tempsetBycoldstorageid))  {
		    			  for (TempSetEntity tempSetEntity : tempsetBycoldstorageid) {
						  	List<DeviceObjectMappingEntity> devmappList = this.deviceMapper.findByTypeOid(18, tempSetEntity.getId());
						  	if(SetUtil.isnotNullList(devmappList)){
						  		if (coldStorageSetEntity.getTempdiff()>0) {
						  			Float maxvalue=null;
						  			float minvalue=	coldStorageSetEntity.getStartTemperature()+coldStorageSetEntity.getTempdiff()/2+level*2;
						  			if(level==5){
						  				maxvalue=null;
						  			}else{
						  				maxvalue=minvalue+2;
						  			}
							  		List<StorageKeyValue> overTempList = this.tempWarningMapper.getOverTempByDevId(devmappList.get(0).getDeviceid(), minvalue, maxvalue, startTime,null);//
							  		if(SetUtil.isnotNullList(overTempList)){
							  			long second=0;
							  			long sumsecond=0;
							  			Date oldtime=overTempList.get(0).getTime();
							  			Integer pl=devStatusMapper.getPLByDEVName(devmappList.get(0).getDeviceid(), 2);if(pl==null){pl=30;}//获得采集频率
							  			for (StorageKeyValue storageKeyValue : overTempList) {
							  				second = TimeUtil.secondBetween(oldtime, storageKeyValue.getTime());//误差10
							  				if(second-10<pl){//连续温度
							  					sumsecond+=second;//
							  				}
										}
							  			//逻辑
							  			
							  			
							  			
							  			
							  			
							  			
							  			
							  			
							  			
							  			
							  		}
							  		
								}
						  	}
						  }
		    		  }
				   }
		      }
			}
		}
    }
    
  
	
}
