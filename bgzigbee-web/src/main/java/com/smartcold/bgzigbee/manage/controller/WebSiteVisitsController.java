package com.smartcold.bgzigbee.manage.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.WebSiteVisitsMapper;
import com.smartcold.bgzigbee.manage.util.SetUtil;
import com.smartcold.bgzigbee.manage.util.TimeUtil;



@Controller
@RequestMapping(value = "/webSiteVisitsController")
public class WebSiteVisitsController extends BaseController {

	@Autowired
	private WebSiteVisitsMapper web;
	
	private static HashMap<String, Object> cahcer=new HashMap<String, Object>();
	
	// 模块访问量
	@RequestMapping(value = "/getModular")
	@ResponseBody
	public Object getModular(){
		if(cahcer.containsKey("CA_MODULAR")){return cahcer.get("CA_MODULAR");}
		 HashMap<Object, Object> result=new HashMap<Object, Object>();
		 List<HashMap<String, Object>> modular = this.web.getModular();
		 if(SetUtil.isnotNullList(modular)){
			 for (HashMap<String, Object> hashMap : modular) {
				 result.put(hashMap.get("modular"), hashMap.get("count"));
			}
		 }
		 WebSiteVisitsController.cahcer.put("CA_MODULAR", result);
		 return result;
	}
	
	//頂部
	@RequestMapping(value = "/getMLCount")
	@ResponseBody
	public Object  getMLCount(){
		if(cahcer.containsKey("CA_MLCOUNT")){return cahcer.get("CA_MLCOUNT");}
		HashMap<String, Object> result=new HashMap<String, Object>();
		result.put("PLC", this.web.getPLCCount());
		result.put("DEV", this.web.getDEVCount());
		result.put("US", this.web.getCountUsers());//用户总量
		result.put("VS", this.web.getVisits());//总访问量
		result.put("RS", this.web.getRSCount());//RDC
		result.put("WR", this.web.getWRCount());//总访问量
		WebSiteVisitsController.cahcer.put("CA_MLCOUNT", result);
		return result;
	}
	
	//others 
	@RequestMapping(value = "/getWEBSV")
	@ResponseBody
	public Object getWEBSV(){
		if(cahcer.containsKey("CA_WEBSV")){return cahcer.get("CA_WEBSV");}
		HashMap<String, Object> alldata= new HashMap<String, Object>();
		int sms=0;int swk=0;
		String [] tims=new String[7];Integer [] etvl=new Integer[7];Integer [] wkvl=new Integer[7];Integer [] auvl=new Integer[7];
		for (int i = 0; i <7; i++) {
			String [] time = TimeUtil.getDayStatTime(TimeUtil.getBeforeDay(7-i));
			tims[i]=time[0];
			etvl[i] = this.web.getEnrollments(time[1],time[2]);
			wkvl[i] = this.web.getWeeklyVisits(time[1],time[2]);
			auvl[i] = this.web.getAUVisits(time[1],time[2]);
			sms+=etvl[i];swk+=wkvl[i];
		}
		alldata.put("TIMS", tims);alldata.put("ET", etvl);alldata.put("WK", wkvl);alldata.put("SMS", sms);alldata.put("SWK", swk);alldata.put("AU", auvl);
		WebSiteVisitsController.cahcer.put("CA_WEBSV", alldata);
		return alldata;
	}	
	
//	@Scheduled(cron = "0 0/30 * * * ?")
	@Scheduled(cron="0 0 8/1,0 * * ?")
	public void cleraData() {
		cahcer.clear();
	}
	
}
