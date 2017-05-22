package com.smartcold.manage.cold.service.task;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.jobs.taskutil.QuartzManager;
import com.smartcold.manage.cold.jobs.taskutil.ScheduleJob;
import com.smartcold.manage.cold.service.TempWarningService;
import com.smartcold.manage.cold.util.TimeUtil;


/**
 * 告警服务
 * Copyright (C) DCIS 版权所有 功能描述: TempWarningService Create on MaQiang
 * 2016年9月27日11:55:45
 * 
 * 仅238执行
 **/
@Service
public class WarningTaskService  {
	@Autowired
	private TempWarningService tempWarningServer;

	
	/**
	 * 每天凌晨1:30点触发
	 * Task:刪除临时任务
	 * 重置dev
	 */
	@Scheduled(cron = "0 10 1 * * ?")
	public void delTempTask() {
		System.err.println("清除任务===============================");
		System.err.println("清除任务："+JSONArray.toJSONString(QuartzManager.getTempListen()));
		QuartzManager.shutdownJobs();
		System.err.println("清除任务===============================");
	}
	
	/**
	 * 单任务模式
	 * 检查温度报警
	 * 30分钟检查一次
	 * 定时定点监听
	 * 1.查询当前冷库的基准温度，计算max min 临界值时间温度 
	*/
	@Scheduled(cron = "0 0/30 * * * ?")
	public void checkData() {
		 long cutttTime=System.currentTimeMillis();
		System.err.println(JSONArray.toJSONString(QuartzManager.getTempListen()));
		String endtime =TimeUtil.getDateTime();
		String starttime =TimeUtil.getDateTime(TimeUtil.getBeforeMinute(30));
		List<ColdStorageSetEntity> allMonitorTempSet = this.tempWarningServer.getAllMonitorTempSet();//1.获得正常监控温度信息
		int key=0;float baseTemp=0;
		for (ColdStorageSetEntity colditem : allMonitorTempSet) {
			key=colditem.getId(); baseTemp=	colditem.getTempdiff()/2+colditem.getStartTemperature()+2;//基线温度
			ItemValue maxTempData = this.tempWarningServer.getMAITempData(key, 0, colditem.getDeviceid(),starttime, endtime);//升溫后最小值
			if(maxTempData==null){continue;	}//故障  没数据
			ItemValue minTempData = this.tempWarningServer.getMAITempData(key, 1,TimeUtil.getDateTime(maxTempData.getAddtime()), starttime, endtime);
			ScheduleJob job = QuartzManager.getJob(key);
		    double	lastminval= minTempData.getValue()-baseTemp;
			if(lastminval<0){//超温后温度下降正常 移除超温监听
				if(job!=null&&job.getMaxval()-baseTemp<8){
					  QuartzManager.removeJob(key);
				}else{//之前出现过超温  立即检测
					 long croStartTime=cutttTime+60000;
					 job.setMaxval(maxTempData.getValue());
					 job.setCroStartTime(croStartTime);
					 job.setEndTime(minTempData.getAddtime());
					 job.setTask(true);
					 QuartzManager.upJob(key,  job);// 
				}
			}else{//持续升温中
				if(job!=null){
					job.setMaxval(maxTempData.getValue());//只能升级--不做降级
					job.setMinval(minTempData.getValue());
					long downMint = TimeUtil.getDownMint(job.getCroStartTime());
		    		System.err.println(job.getName() +"剩余时间："+downMint);
		    		if(downMint>10){//
		    			int level = job.getLevel();
		    			if(level<3){
		    				job.setWarcount(job.getWarcount()+1);
		    				if(job.getWarcount()>6){job.setTask(true);}
		    			}else{
		    				job.setTask(true);
		    			}
		    			QuartzManager.upJob(key, job);
		    		}
				}else{
				   double diffTemp=   	maxTempData.getValue()-baseTemp;//
				   int lavel=  (int) (diffTemp/2);
				   long croStartTime=cutttTime+(lavel>3 ?3600000:14400000);//1个小时后执行 ：4个小时后执行
				   ItemValue overStrtTime = this.tempWarningServer.getOverStrtTime(key, baseTemp, colditem.getDeviceid(), starttime, TimeUtil.getDateTime(maxTempData.getAddtime()));
				   String jobName=croStartTime+"_job";//延迟一个小时执行
				   job = new ScheduleJob(key,1,baseTemp,"MY_JOBGROUP_NAME", jobName, croStartTime,cutttTime);
				   job.setStartTime(overStrtTime.getAddtime());
				   job.setTask(lavel>3);
				   job.setColdStorageSetEntity(colditem);
           		   job.setMaxval(maxTempData.getValue());
           		   job.setMinval(minTempData.getValue());
           		   QuartzManager.addJob(key,  job);// 
				}
			}
		}
	}	
	/**
	 * 单任务模式
	 * 检查温度报警
	 * 30分钟检查一次
	 * 定时定点监听
	 * 1.查询当前冷库的基准温度，计算max min 临界值时间温度 

	@Scheduled(cron="0/30 * * * * ?")
	public void checkData() {
		String endtime =TimeUtil.getDateTime();
		String starttime =TimeUtil.getDateTime(TimeUtil.getBeforeMinute(30));
		List<ColdStorageSetEntity> allMonitorTempSet = this.tempWarningServer.getAllMonitorTempSet();//1.获得正常监控温度信息
		int key=0;float baseTemp=0;
		boolean warning=false;//告警
		boolean isAlarm=false;//预警
		for (ColdStorageSetEntity colditem : allMonitorTempSet) {
			ItemValue minTempData=null;
			warning=false;isAlarm=false; key=colditem.getId(); baseTemp=	colditem.getTempdiff()/2+colditem.getStartTemperature()+2;//基线温度
			ItemValue maxTempData = this.tempWarningServer.getMAITempData(key,colditem.getColdStorageID(), 0, colditem.getDeviceid(), starttime, endtime);
			if(maxTempData==null){continue;	}//故障  没有数据
			ScheduleJob job = QuartzManager.getJob(key);
			minTempData = this.tempWarningServer.getMAITempData(key,colditem.getColdStorageID(), 1, colditem.getDeviceid(),TimeUtil.getDateTime(maxTempData.getAddtime()), endtime);//升溫后最小值
			warning=maxTempData.getValue()-baseTemp>10;
			isAlarm=minTempData.getValue()-baseTemp<0;//是否恢复正常
			 if(job!=null){
				 if(isAlarm){//现在恢复正常
						if(job.getMaxval()-baseTemp>10||warning){//  立即检查数据
							  long msgId=System.currentTimeMillis()+60000;
		            		  job.setTask(true);
		            		  job.setMaxval(maxTempData.getValue());
		            		  job.setCroStartTime(msgId);
		            		  job.setEndTime(minTempData.getAddtime());//
		            		  QuartzManager.upJob(key, msgId, job);// 1分钟后执行检查  minTempData
						}else{
							  QuartzManager.removeJob(key);//删除监听任务
						}
				}else{//没有恢复
					     long minuteBetween = TimeUtil.minuteBetween(minTempData.getAddtime(), job.getStartTime());
						if((job.getMaxval()-baseTemp>10||warning)&&minuteBetween>30){	//超过8度且时
							 long msgId=System.currentTimeMillis()+60000;
		            		  job.setTask(true);
		            		  job.setMaxval(maxTempData.getValue());
		            		  job.setCroStartTime(msgId);
		            		  job.setEndTime(minTempData.getAddtime());//
		            		  QuartzManager.upJob(key, msgId, job);// 1分钟后执行检查  minTempData
						}else{
							long msgId=System.currentTimeMillis();//延遲一個小時
							if(minuteBetween<60){
								msgId=msgId+3600000;
							}else{
								msgId=msgId+60000;
							}
							 job.setTask(true);
		            		  job.setMaxval(maxTempData.getValue());
		            		  job.setCroStartTime(msgId);
		            		  job.setEndTime(minTempData.getAddtime());//
		            		  QuartzManager.upJob(key, msgId, job);// 1分钟后执行检查  minTempData
						}
			     }
			 }else{
				 if(warning){//  立即检查数据
					 long msgId=System.currentTimeMillis();
					 long sendTime=msgId+60000;
				   	 String jobName=msgId+"_job";
					 job = new ScheduleJob("MY_JOBGROUP_NAME", jobName, sendTime);
	           		  job.setTask(true);
	           		  job.setMaxval(maxTempData.getValue());
	           		  job.setCroStartTime(msgId);
	           		  job.setEndTime(minTempData.getAddtime());//
	           		  QuartzManager.upJob(key, msgId, job);// 1分钟后执行检查  minTempData
				}else{
					if(!isAlarm){
						 long msgId=System.currentTimeMillis();
						 long sendTime=msgId+3600000;
					   	 String jobName=msgId+"_job";
						 job = new ScheduleJob("MY_JOBGROUP_NAME", jobName, sendTime);
		           		  job.setTask(false);
		           		  job.setMaxval(maxTempData.getValue());
		           		  job.setCroStartTime(msgId);
		           		  job.setEndTime(minTempData.getAddtime());//
		           		  QuartzManager.upJob(key, msgId, job);// 1分钟后执行检查  minTempData
					}
					
					
				}
				 
				 
			 }
			
		}
	}
		*/
}
