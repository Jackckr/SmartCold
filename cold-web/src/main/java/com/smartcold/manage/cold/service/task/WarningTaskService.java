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
import com.smartcold.manage.cold.util.StringUtil;
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
    private static 	List<Integer> Blacklist=Lists.newArrayList();
	
	
	/**
	 * 每天凌晨1:10点触发
	 * Task:刪除临时任务
	 * 重置dev
	 */
	@Scheduled(cron = "0 10 1 * * ?")
	public void delTempTask() {
		Blacklist.clear();
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
		Date sttime = TimeUtil.getBeforeMinute(10);
		String endtime =TimeUtil.getDateTime();
		String starttime =TimeUtil.getDateTime(sttime);
		if(allMonitorTempSet.size()==0||excute>6){
			QuartzManager.tempWarningServer=this.tempWarningServer;
			QuartzManager.sysWarningsInfoMapper=this.sysWarningsInfoMapper;
			allMonitorTempSet = this.tempWarningServer.getAllMonitorTempSet();//1.获得正常监控温度信息
		}
		int key=0;float baseTemp=0;
		for (ColdStorageSetEntity colditem : allMonitorTempSet) {
			key=colditem.getId();//冷库id
			if(Blacklist.contains(key)){continue;}if(StringUtil.isNull(colditem.getTids())){ Blacklist.add(key);  continue;}//过滤无效数据
		    baseTemp=	colditem.getTempdiff()/2+colditem.getStartTemperature()+2;
		    colditem.setBaseTemp(baseTemp);//计算基线温度
			ItemValue minTempData = this.tempWarningServer.getMAITempData(colditem.getTids(), 0, colditem.getDeviceid(),starttime, endtime);//获得最低温度
			if(minTempData==null){ Blacklist.add(key);  continue;	}//故障  没数据
			ScheduleJob job = QuartzManager.getJob(key);  long cutttTime=System.currentTimeMillis();
			if(minTempData.getValue()<baseTemp){
				if(job==null){
				   continue; //
				 }else	if(job.getWarcount()<3||(job.getLevel()==4&&job.getWarcount()<6)||(job.getLevel()==3&&job.getWarcount()<12)||(job.getLevel()==2&&job.getWarcount()<18)||(job.getLevel()==1&&job.getWarcount()<24)){ 
						  QuartzManager.removeJob(key);
						  QuartzManager.logs.add(TimeUtil.getDateTime()+" 移除任务监听:"+key);
				}else{
					System.err.println("进入未知逻辑");
				}
			}else {
				int lavel = (int) Math.rint(minTempData.getValue()- baseTemp+0.5 )/ 2;
				if(lavel>5){lavel=5;}//判断当前冷库超温级别
				if(job==null){
					 ItemValue  overStrtTime = this.tempWarningServer.getOverStrtTime(colditem.getTids(), baseTemp, colditem.getDeviceid(), starttime, endtime);
					 if(overStrtTime==null){continue; }else{
						  long croStartTime=cutttTime+(lavel>4 ?1800000:14400000);//30分钟后执行 ：4个小时后执行
						  String jobName=croStartTime+"_job";//
						   job = new ScheduleJob(key,"MY_JOBGROUP_NAME", jobName, croStartTime,cutttTime);
						   job.setStartTime(overStrtTime.getAddtime());
						   job.setTask(false);
						   job.setWarcount(1);
						   job.setLevel(lavel);
						   job.setColdStorageSetEntity(colditem);
		           		   QuartzManager.addJob(key,  job);// 
		           	       QuartzManager.logs.add(TimeUtil.getDateTime()+" 添加任务："+key); 
					 }
				 }else{
					 job.setLevel(lavel);
				     job.setWarcount(job.getWarcount()+1);
					 long downMint = TimeUtil.getDownMint(job.getCroStartTime());
					 if((downMint<0||job.getLevel()==5&&job.getWarcount()>=3)||(job.getLevel()==4&&job.getWarcount()>=6)||(job.getLevel()==3&&job.getWarcount()>=12)||(job.getLevel()==2&&job.getWarcount()>=18)||(job.getLevel()==1&&job.getWarcount()>=24)){
						 job.setTask(true);
						 job.setCroStartTime(cutttTime+30000);//半分钟后执行
					 }
		    		 QuartzManager.upJob(key, job);
		    		 QuartzManager.logs.add(TimeUtil.getDateTime()+" 更新任务"+key+"剩余时间："+downMint);
				 }
			}
		}
	}	
}
