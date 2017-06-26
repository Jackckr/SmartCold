package com.smartcold.manage.cold.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.newdb.AlarmMapper;
import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.SysWarningsInfo;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
import com.smartcold.manage.cold.util.RemoteUtil;
import com.smartcold.manage.cold.util.ResponseData;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.StringUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 新的告警
 *  1.温度告警
 *  2.运管告警
 *  3.制冷告警
 *  4.其他告警
 * 
 * @author MaQiang34 2017-5-19 16:53:46
 *
 */
@Controller
@RequestMapping(value = "/AlarmController")
public class AlarmController extends BaseController {

	
	@Autowired
	private AlarmMapper alarmMapper;
	@Autowired
	private SysWarningsInfoMapper syswarninginfoMapper;
	@Autowired
	private ColdStorageAnalysisService coldStorageAnalysisService;
	
	
	
	
	/**
	 * 
	 * @param userId
	 * @param type:
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/getAlarmMsg")
	@ResponseBody
	public  HashMap<String, Object> getAlarmMsg(int userId,int type,int rdcId,Boolean isgetMsg) {
		HashMap<String, Object> reasHashMap=new HashMap<String, Object>();
		reasHashMap.put("alarmCount", 1);
		if(isgetMsg!=null&&isgetMsg){
			List<SysWarningsInfo> warningsInfos=Lists.newArrayList();
			warningsInfos.add(new SysWarningsInfo(1063,32,1,1,"2017-6-26 13:26:32","2017-6-26 13:04:36",30,"冷库1超温","","2017-6-26 13:05:40"));
			reasHashMap.put("alarmMsg", warningsInfos);
		}
		return null;    
	}
	
	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getOverTempDetail")
	@ResponseBody
	public List<SysWarningsInfo> getOverTempDetail(Integer rdcId,String time) {
		String starttime=time+" 00:00:00",endtime=time+" 23:59:59";
		return this.syswarninginfoMapper.getSysWarningByFilter(rdcId, null, 1, null, starttime, endtime);
	}
	

	
	
	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getOverTempByTime")
	@ResponseBody
	public List<SysWarningsInfo> getOverTempByTime(int rdcId,int oid,int level,String starttime,String endtime) {
		return this.syswarninginfoMapper.getSysWarningByFilter(rdcId, oid+"", 1, 1, starttime, endtime);
	}
	
	
	
	
	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getOverTempAnalysis")
	@ResponseBody
	public ResponseData<LinkedHashMap<String, double[]>> getOverTempAnalysis(Integer rdcId,String oids) {
		try {
			if(StringUtil.isNull(oids)){return ResponseData.newFailure();}
			LinkedHashMap<String,double[]> dataHashMap=new LinkedHashMap<String,double[]>();
			for (int i = 0; i < 6; i++) {
				Calendar c = Calendar.getInstance(); c.add(Calendar.DAY_OF_MONTH, -6 + i); 
				dataHashMap.put(TimeUtil.getFormatDate(c.getTime()), new double[]{0,0});
			}
            List<ColdStorageAnalysisEntity> timeMap = this.alarmMapper.getSumValueByFilter(1, oids, "'OverTempTime','OverTempCount'", TimeUtil.getDateTime(TimeUtil.getBeforeDay(6)), TimeUtil.getDateTime());
            if(SetUtil.isnotNullList(timeMap)){
             for (ColdStorageAnalysisEntity item : timeMap) {
        			dataHashMap.get(TimeUtil.getFormatDate(item.getDate()))["OverTempTime".equals(item.getKey())?0:1]=item.getValue();
   			 } 
           }
            long overcount=0, overtime=0;
            String time = TimeUtil.getFormatDate(new Date());
           List<SysWarningsInfo> overTempDetail = this.getOverTempDetail(rdcId, time);
           if(SetUtil.isnotNullList(overTempDetail)){
        	   for (SysWarningsInfo sysWarningsInfo : overTempDetail) {
        		   overcount++;
        		   overtime+=sysWarningsInfo.getLongtime();
			   }
           }
           dataHashMap.put(time,  new double[]{overtime,overcount});
           
			return ResponseData.newSuccess(dataHashMap);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("查询错误！请稍后重试！");
		}
	}
	
	
	@RequestMapping(value = "/getOverTempByFilter")
	@ResponseBody
	public ResponseData<LinkedHashMap<String, double[]>> getOverTempByFilter(Integer rdcId,String oids,String startTime,String endTime) {
		try {
			if(StringUtil.isNull(oids)||StringUtil.isNull(startTime)||StringUtil.isNull(endTime)){return ResponseData.newFailure();}
			LinkedHashMap<String,double[]> dataHashMap=new LinkedHashMap<String,double[]>();
            List<ColdStorageAnalysisEntity> timeMap = this.alarmMapper.getSumValueByFilter(1, oids, "'OverTempTime','OverTempCount'", startTime, endTime);
            if(SetUtil.isnotNullList(timeMap)){
             for (ColdStorageAnalysisEntity item : timeMap) {
            	    String data = TimeUtil.getFormatDate(item.getDate());
            	    if(dataHashMap.containsKey(data)){
            	    	dataHashMap.get(data)["OverTempTime".equals(item.getKey())?0:1]=item.getValue();
            	    }else{
            	    	double[] temp=new double[]{0,0};
            	    	temp["OverTempTime".equals(item.getKey())?0:1]=item.getValue();
            	    	dataHashMap.put(data, temp);
            	    }
                }
            }
			return ResponseData.newSuccess(dataHashMap);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("查询错误！请稍后重试！");
		}
	}
	
	
	

}
