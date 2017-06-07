package com.smartcold.manage.cold.controller;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.AlarmMapper;
import com.smartcold.manage.cold.entity.newdb.ColdStorageAnalysisEntity;
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
	private ColdStorageAnalysisService coldStorageAnalysisService;
	/**
	 * @param rdcId:冷库ID
	 * @return
	 */
	@RequestMapping(value = "/getOverTempAnalysis")
	@ResponseBody
	public ResponseData<HashMap<String, double[]>> getOverTempAnalysis(String oids) {
		try {
			if(StringUtil.isNull(oids)){return ResponseData.newFailure();}
			HashMap<String,double[]> dataHashMap=new HashMap<String,double[]>();
			for (int i = 0; i < 7; i++) {
				Calendar c = Calendar.getInstance(); c.add(Calendar.DAY_OF_MONTH, -7 + i); 
				dataHashMap.put(TimeUtil.getFormatDate(c.getTime()), new double[]{0,0});
			}
            List<ColdStorageAnalysisEntity> timeMap = this.alarmMapper.getSumValueByFilter(1, oids, "'OverTempTime','OverTempCount'", TimeUtil.getDateTime(TimeUtil.getBeforeDay(7)), TimeUtil.getDateTime());
           if(SetUtil.isnotNullList(timeMap)){
           for (ColdStorageAnalysisEntity item : timeMap) {
        			dataHashMap.get(TimeUtil.getFormatDate(item.getDate()))["OverTempTime".equals(item.getKey())?0:1]=	 item.getValue();
               
   			} 
           }
			return ResponseData.newSuccess(dataHashMap);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseData.newFailure("查询错误！请稍后重试！");
		}
	}
	

}
