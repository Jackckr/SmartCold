package com.smartcold.manage.cold.service.task;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
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
//@Service
public class WarningTaskService  {
	@Autowired
	private TempWarningService tempWarningServer;
	@Autowired
	private SysWarningsInfoMapper sysWarningsInfoMapper;
 
	private static int excute=0;
	
    private static 	List<ColdStorageSetEntity> allMonitorTempSet=Lists.newArrayList();
	
	
	/**
	 * 每天凌晨1:10点触发
	 * Task:刪除临时任务
	 * 重置dev
	 */
	@Scheduled(cron = "0 10 1 * * ?")
	public void delTempTask() {
		QuartzManager.logs.clear();
		QuartzManager.shutdownJobs();
		QuartzManager.logs.add(TimeUtil.getDateTime()+" 清空任务");
	}
	
	/**
	 * 单任务模式
	 * 检查温度报警
	 * 30分钟检查一次
	 * 定时定点监听
	 * 1.查询当前冷库的基准温度，计算max min 临界值时间温度 
	*/
	@Scheduled(cron = "0 0/10 * * * ?")
	public void checkData() {
		excute++;
		if(QuartzManager.logs.size()>100){	QuartzManager.logs.clear();}
		QuartzManager.tempWarningServer=this.tempWarningServer;
		QuartzManager.sysWarningsInfoMapper=this.sysWarningsInfoMapper;
		Date sttime = TimeUtil.getBeforeMinute(10);
		String endtime =TimeUtil.getDateTime();
		String starttime =TimeUtil.getDateTime(sttime);
		if(allMonitorTempSet.size()==0||excute>3){
			allMonitorTempSet = this.tempWarningServer.getAllMonitorTempSet();//1.获得正常监控温度信息
		}
		int key=0;float baseTemp=0;
		for (ColdStorageSetEntity colditem : allMonitorTempSet) {
			key=colditem.getId(); baseTemp=	colditem.getTempdiff()/2+colditem.getStartTemperature()+2;//基线温度
			ItemValue maxTempData = this.tempWarningServer.getMAITempData(key, 0, colditem.getDeviceid(),starttime, endtime);//升溫后最小值
			if(maxTempData==null){continue;	}//故障  没数据
			ItemValue minTempData = this.tempWarningServer.getMAITempData(key, 1,colditem.getDeviceid(),TimeUtil.getDateTime(maxTempData.getAddtime()),  endtime);
			if(minTempData==null){minTempData=maxTempData;}
			ScheduleJob job = QuartzManager.getJob(key);
		    double	lastminval= minTempData.getValue()-baseTemp;
		    long cutttTime=System.currentTimeMillis();
			
		}
	}	
}
