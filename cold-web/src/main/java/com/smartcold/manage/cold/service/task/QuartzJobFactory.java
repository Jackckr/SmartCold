package com.smartcold.manage.cold.service.task;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.SysWarningsInfo;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.jobs.taskutil.QuartzManager;
import com.smartcold.manage.cold.jobs.taskutil.ScheduleJob;
import com.smartcold.manage.cold.service.TempWarningService;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: QuartzJobFactory 
 * Create on MaQiang34 2017-5-11 15:06:34
 */
//@Service
//@DisallowConcurrentExecution
public class QuartzJobFactory implements Job {

	@Autowired
	private TempWarningService tempWarningServer;
	@Autowired
	private SysWarningsInfoMapper sysWarningsInfoMapper;

	private static final Logger log = Logger.getLogger(QuartzJobFactory.class);

	@Override
	public void execute(JobExecutionContext context)throws JobExecutionException {
		try {
//			System.err.println("=======================================");
			int key = (int) context.getMergedJobDataMap().get("sid");
			ScheduleJob job = QuartzManager.getJob(key);
			if (job != null) {
				int oldelev = 0;
				boolean isreturn=false;
				double basTemp = -28;
				Date Lt[] = { null, null, null, null, null, null, null };  // 各个级别报警开始时间
				int Lv[] = { 0, 0, 0, 0, 0 }, Tv[] = { 30, 60, 120, 180, 240 };// 各个级别出现的次数// 各个级别错误告警时间
				ColdStorageSetEntity colditem = job.getColdStorageSetEntity();
				QuartzManager.removeJob(key);// 清除任务
				List<ItemValue> tempList = this.tempWarningServer.getOverTempList(colditem.getId(), null,colditem.getDeviceid(),TimeUtil.getDateTime(job.getStartTime()),TimeUtil.getDateTime());// 获得所有超温数据
				if (SetUtil.isnotNullList(tempList) && tempList.size() > 5) {//过滤掉坏的数据
					List<SysWarningsInfo> warningList = new ArrayList<SysWarningsInfo>();
						for (ItemValue temp : tempList) {
							if(isreturn){break;}
							if(temp.getValue()<basTemp){ Lv =new int[]{ 0, 0, 0, 0, 0 };continue;}//温度恢复后
							int leve = (int) Math.floor(temp.getValue() - basTemp+0.5 )/ 2;
							if (leve > 4) {leve = 4;}
							for (int i = 0; i < leve; i++) {//记录同级超温次数
								 Lv[i] ++;//Lv[i] =
								if (Lt[i] == null) {Lt[i] = temp.getAddtime();}
							}
							if (leve<oldelev) {//降级高于当前温度
								if(oldelev>2){
									for (int i = 4; i >oldelev; i--) {//从高到低算
										double overtime = Tv[i];//不同级别超温数据不定
										long minuteBetween = TimeUtil.minuteBetween(Lt[i],temp.getAddtime());
						                 if(minuteBetween >=overtime){
						            		 warningList.add(new SysWarningsInfo(colditem.getRdcId(), colditem.getColdStorageID(), 1,1, TimeUtil.getDateTime(Lt[5]),TimeUtil.getDateTime(temp.getAddtime()),minuteBetween, "", TimeUtil.getDateTime()));
						            		 isreturn=true;
						            		 break;
						            	 }
						            	 Lv[i] = 0;Lt[i] = null;//计算完成后重置
									}// 升级
								}
							} 
						    oldelev = leve;
						}
						if(!isreturn){//没有高级报警4~5  
							Date endtime=tempList.get(tempList.size()-1).getAddtime();
							for (int i = 4; i>=0;i--) {//记录同级超温次数
								if(Lv[i]>0){
									double overtime = Tv[i];//不同级别超温数据不定
									long minuteBetween = TimeUtil.minuteBetween(Lt[i],endtime);
					                 if(minuteBetween >=overtime){
					            		 warningList.add(new SysWarningsInfo(colditem.getRdcId(), colditem.getColdStorageID(), 1,0, TimeUtil.getDateTime(endtime),TimeUtil.getDateTime(endtime),minuteBetween, "超温", TimeUtil.getDateTime()));
					            		 break;
					            	 }
								}
							}
						}
						if(SetUtil.isnotNullList(warningList)){
							this.sysWarningsInfoMapper.addSyswarningsinfo(warningList);
						}
					}
			}
		} catch (Exception e) {
			log.info("捕获异常===" + e);
		}
	}

	
}
