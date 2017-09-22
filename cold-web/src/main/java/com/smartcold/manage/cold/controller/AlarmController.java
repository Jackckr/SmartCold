package com.smartcold.manage.cold.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.AlarmMapper;
import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
import com.smartcold.manage.cold.entity.newdb.SysWarningsInfo;
import com.smartcold.manage.cold.service.ColdStorageAnalysisService;
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
	public  HashMap<String, Object> getAlarmMsg(int userId,int type,int rdcId) {
		String[] time = TimeUtil.getDayTime();
		HashMap<String, Object> reasHashMap=new HashMap<String, Object>();
		reasHashMap.put("TC", this.syswarninginfoMapper.getSysWarcountByFilter(rdcId,  1,time[0], time[1]));//获得超温告警信息
		reasHashMap.put("CC", this.syswarninginfoMapper.getSysWarcountByFilter(rdcId,  2,time[0], time[1]));//获得操作不当信息
		reasHashMap.put("SC", this.syswarninginfoMapper.getSysWarcountByFilter(rdcId,  3,time[0], time[1]));//获得系统告警信息
		return reasHashMap;    
	}
	/**
	 * 
	 * @param userId
	 * @param type:
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/getDatilAlarmMsg")
	@ResponseBody
	public  List<SysWarningsInfo> getDatilAlarmMsg(int userId,int type,int rdcId) {
		String[] time = TimeUtil.getDayTime();
		return this.syswarninginfoMapper.getSysWarningByFilter(rdcId, null, type, null, time[0], time[0]);
	}
	
	/**
	 * 
	 * @param userId
	 * @param type:
	 * @param rdcId
	 * @return
	 */
	@RequestMapping(value = "/getAlarmMsgByUser")
	@ResponseBody
	public  HashMap<String, Object> getAlarmMsgByUser( int userId,int role,int [] rdcIds,Boolean isgetMsg) {
		if(rdcIds==null||rdcIds.length==0){return null;}
		String[] time = TimeUtil.getDayTime();
		String ids = StringUtil.getIdS(rdcIds);
		HashMap<String, Object> reasHashMap=new HashMap<String, Object>();
		reasHashMap.put("TC", this.syswarninginfoMapper.getSysWarcountByFilter(ids,  1,time[0], time[1]));//获得超温告警信息
		reasHashMap.put("CC", this.syswarninginfoMapper.getSysWarcountByFilter(ids,  2,time[0], time[1]));//获得操作不当信息
		reasHashMap.put("SC", this.syswarninginfoMapper.getSysWarcountByFilter(ids,  3,time[0], time[1]));//获得系统告警信息
		if(isgetMsg!=null&&isgetMsg){
			reasHashMap.put("TM", this.syswarninginfoMapper.getSysWarningByFilter(ids, null, 1, null, time[0], time[0]));//超温消息
			reasHashMap.put("CM", this.syswarninginfoMapper.getSysWarningByFilter(ids, null, 2, null, time[0], time[0]));//操作不当消息
			reasHashMap.put("SM", this.syswarninginfoMapper.getSysWarningByFilter(ids, null, 3, null, time[0], time[0]));//系统告警
		}
		return reasHashMap;    
	}
	
	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getOverTempDetail")
	@ResponseBody
	public List<SysWarningsInfo> getOverTempDetail(int rdcId,int oids,String time) {
		String starttime=time+" 00:00:00",endtime=time+" 23:59:59";
		return this.syswarninginfoMapper.getSysWarningByFilter(rdcId, oids, 1, null, starttime, endtime);
	}
	
	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getOverTempByTime")
	@ResponseBody
	public List<SysWarningsInfo> getOverTempByTime(int rdcId,int oid,int level,String startTime,String endTime) {
		return this.syswarninginfoMapper.getSysWarningByFilter(rdcId, oid+"", 1, level, startTime, endTime);
	}
	
	
	
	
	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getOverTempAnalysis")
	@ResponseBody
	public ResponseData<LinkedHashMap<String, double[]>> getOverTempAnalysis(Integer rdcId,String oids) {
			if(StringUtil.isNull(oids)){return ResponseData.newFailure();}
	        return  this.getOverTempByFilter(rdcId, oids, TimeUtil.getDateTime(TimeUtil.getBeforeDay(7)),  TimeUtil.getDateTime());
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
