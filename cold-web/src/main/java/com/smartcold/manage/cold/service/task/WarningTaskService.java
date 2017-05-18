package com.smartcold.manage.cold.service.task;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.jobs.taskutil.CronExpConversion;
import com.smartcold.manage.cold.jobs.taskutil.QuartzJobFactory;
import com.smartcold.manage.cold.jobs.taskutil.QuartzManager;
import com.smartcold.manage.cold.jobs.taskutil.ScheduleJob;
import com.smartcold.manage.cold.service.TempWarningService;
import com.smartcold.manage.cold.util.TimeUtil;


/**
 * 告警服务
 * Copyright (C) DCIS 版权所有 功能描述: TempWarningService Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class WarningTaskService  {
	@Autowired
	private TempWarningService tempWarningServer;
	@Autowired
    private SysWarningsInfoMapper  sysWarningsInfoMapper;
	
//	private static final Logger log = Logger.getLogger(WarningTaskService.class);
	
  //key=rdc
	

	/**
	 * 单任务模式
	 * 检查温度报警
	 * 30分钟检查一次
	 * 定时定点监听
	 * 1.查询当前冷库的基准温度，计算max min 临界值时间温度 
	*/
	@Scheduled(cron="0/30 * * * * ?")
	public void checkData() {
		/*
		String endtime =TimeUtil.getDateTime();
		String starttime =TimeUtil.getDateTime(TimeUtil.getBeforeMinute(30));
		List<ColdStorageSetEntity> allMonitorTempSet = this.tempWarningServer.getAllMonitorTempSet();//1.获得正常监控温度信息
//		boolean isaddListen=false;//是否加入监听范围
		int key=0;float baseTemp=0;
		for (ColdStorageSetEntity colditem : allMonitorTempSet) {
//			 isaddListen=false;
			 key=colditem.getId(); baseTemp=	colditem.getTempdiff()/2+colditem.getStartTemperature()+2;//基线温度
			ItemValue minTempData=null;
			ItemValue maxTempData = this.tempWarningServer.getMAITempData(key,colditem.getColdStorageID(), 0, colditem.getDeviceid(), starttime, endtime);
			if(maxTempData==null){continue;	}//故障  没有数据
			ScheduleJob job = QuartzManager.getJob(key);
			minTempData = this.tempWarningServer.getMAITempData(key,colditem.getColdStorageID(), 1, colditem.getDeviceid(),starttime, endtime);//当前在区域最小值
			if(minTempData.getValue()<baseTemp){//温度低于基线温度
				
			}else{//温度高压基线
				//
//				String cron = CronExpConversion.getQuartzTime(sendTime);//2
//				QuartzManager.addJob(key, startTime, job);
				
			}
			
			if(maxTempData.getValue()>baseTemp){//最高溫度超出警戒
				
				
				if(job==null){
					
				}else{
					
				}
			}else{
                if(job==null){
					
				}else{
					
				}
			}
			
		}
		*/
	}
	

	
	
	
    

	
}
