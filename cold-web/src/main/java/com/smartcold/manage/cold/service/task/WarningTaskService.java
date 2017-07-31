package com.smartcold.manage.cold.service.task;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.newdb.SysWarningsInfoMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.SysWarningsInfo;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.jobs.taskutil.ScheduleJob;
import com.smartcold.manage.cold.service.TempWarningService;
import com.smartcold.manage.cold.util.SetUtil;
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
    public static 	HashSet<Integer> Blacklist=new HashSet<Integer>();//黑名单(错误配置，温度)
    public static 	HashMap<Integer,Integer> extBlacklist=new HashMap<Integer,Integer>();
	
    private static HashSet<Integer> extsid=new HashSet<Integer>();//需要执行的
	public synchronized static void addExtsid(int key) {extsid.add(key);}
	public synchronized static void clerextsid() {extsid.clear();}
	public synchronized static HashSet<Integer> getExtsid() {return extsid;}
	  //当前任务
	public static HashMap<Integer, ScheduleJob> tempListen=new HashMap<Integer, ScheduleJob>();
	/**
	 * 每天凌晨1:5点触发
	 * 清除黑名单
	 */
	@Scheduled(cron = "0 5 1 * * ?")
	public void delTempTask() {
		Blacklist.clear();
		tempListen.clear();
		extBlacklist.clear();
	}
	
	/**
	 * 每周日晚上1:05执行告警升级
	 */
	@Scheduled(cron = "0 5 1  ? * 7")
	public void delBlacklist() {
		System.err.println("今天周天 我要清除任务");
	}
    /**
     * 30秒检任务队列
     */
	@Scheduled(cron="0/30 * * * * ?")
	public void checkTempWning() {
    	excute();
	}
	
	public static synchronized void upJob(int key,ScheduleJob job){
    	tempListen.put(key, job);
    	if(job.isTask()){
    		extsid.add(key);
    	}
    }
	/**
     * 
     */
    public static synchronized ScheduleJob getJob(int key) {
		return tempListen.get(key);
	}
	
    public static synchronized void addJob(int key,ScheduleJob job){
		tempListen.put(key, job);
	}
    /**
	 * 删除任务
	 * @param oid
	 */
	public static synchronized void removeJob(int key){
		if(tempListen.containsKey(key)){
			tempListen.remove(key);
		}
	}
	
   
    
	private void addAlercoun(int key){
		if(extBlacklist.containsKey(key)){
			Integer count = extBlacklist.get(key);
			if(count<6){
				extBlacklist.put(key, count++);
			}
		}else{
			extBlacklist.put(key, 1);
		}
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
		System.gc();
		excute++;
		Date sttime = TimeUtil.getBeforeMinute(10);
		String endtime =TimeUtil.getDateTime();
		String starttime =TimeUtil.getDateTime(sttime);
		if(allMonitorTempSet.size()==0||excute>12){
			allMonitorTempSet = this.tempWarningServer.getAllMonitorTempSet();//1.获得正常监控温度信息
		}
		int key=0;float baseTemp=0;
		for (ColdStorageSetEntity colditem : allMonitorTempSet) {
			key=colditem.getId();//冷库id
			if(Blacklist.contains(key)){continue;}//||(extBlacklist.containsKey(key)&&extBlacklist.get(key)>5)
			if(StringUtil.isNull(colditem.getTids())){ Blacklist.add(key);  continue;}//过滤无效数据
		    baseTemp=	colditem.getTempdiff()/2+colditem.getStartTemperature()+2;
		    colditem.setBaseTemp(baseTemp);//计算基线温度
		    String deviceid = colditem.getDeviceids();
		    if(StringUtil.isnotNull(deviceid)&&deviceid.indexOf("'")==-1){
		    	String[] split = deviceid.split(",");
		    	 String newdeviceid="";for (String dev : split) {newdeviceid+="'"+dev+"',";}newdeviceid=newdeviceid.substring(0,newdeviceid.length()-1);colditem.setDeviceids(newdeviceid);
		    }
			ItemValue minTempData = this.tempWarningServer.getMAITempData(colditem.getTids(), 0,colditem.getDeviceids(),starttime, endtime);//获得最低温度
			if(minTempData==null){ continue;	}//故障  没数据
			ScheduleJob job =getJob(key); 
			long cutttTime=System.currentTimeMillis();
			if(minTempData.getValue()<baseTemp){
				if(job==null){
				   continue; //
				 }else{
					 if(job.getWarcount()<3||(job.getLevel()==4&&job.getWarcount()<6)||(job.getLevel()==3&&job.getWarcount()<12)||(job.getLevel()==2&&job.getWarcount()<18)||(job.getLevel()==1&&job.getWarcount()<24)){ 
						  removeJob(key);
					 }else{
						 job.setTask(true);
						 upJob(key, job);
					}
				}
			}else {
				int lavel = (int) Math.rint(minTempData.getValue()- baseTemp+0.5 )/ 2;
				if(lavel>5){lavel=5;}//判断当前冷库超温级别
				if(job==null){
					 ItemValue  overStrtTime = this.tempWarningServer.getOverStrtTime(colditem.getTids(), baseTemp, colditem.getDeviceids(), starttime, endtime);
					 if(overStrtTime==null){
						 overStrtTime=minTempData;
					 }
					 long croStartTime=cutttTime+(lavel>4 ?1800000:14400000);//30分钟后执行 ：4个小时后执行
					 String jobName=croStartTime+"_job";//
					 job = new ScheduleJob(key,"MY_JOBGROUP_NAME", jobName, croStartTime,cutttTime);
					 job.setStartTime(overStrtTime.getAddtime());
					 job.setTask(false);
					 job.setWarcount(1);
					 job.setLevel(lavel);
					 job.setColdStorageSetEntity(colditem);
	           		 addJob(key,  job);// 
				 }else{
					 job.setLevel(lavel);
				     job.setWarcount(job.getWarcount()+1);
					 long downMint = TimeUtil.getDownMint(job.getCroStartTime());
					 if((downMint<0||job.getLevel()==5&&job.getWarcount()>=3)||(job.getLevel()==4&&job.getWarcount()>=6)||(job.getLevel()==3&&job.getWarcount()>=12)||(job.getLevel()==2&&job.getWarcount()>=18)||(job.getLevel()==1&&job.getWarcount()>=24)){
						 job.setTask(true);
						 job.setCroStartTime(cutttTime+30000);//半分钟后执行
					 }
		    		 upJob(key, job);
				 }
			}
		}
	}	
	
	/**
	 * 执行数据校验
	 */
	private  void excute(){
	 if(extsid.size()>0){
		   try {
		   	HashMap<Integer, SysWarningsInfo> allWarningList=new HashMap<Integer, SysWarningsInfo>();
			   LinkedList<Integer> newextsid=new LinkedList<Integer>();newextsid.addAll(extsid);clerextsid();
			   for (Integer key : newextsid) {
					ScheduleJob job = getJob(key);
					if (job == null) {return;}
					removeJob(key);// 清除任务
					int oldelev = 0;
					boolean isreturn=false;
					Date Lt[] = { null, null, null, null, null, null, null };  // 各个级别报警开始时间
					int Lv[] = { 0, 0, 0, 0, 0 }, Tv[] = { 240,180,120,60,30 };// 各个级别出现的次数// 各个级别错误告警时间
					ColdStorageSetEntity colditem = job.getColdStorageSetEntity();
					double basTemp = colditem.getBaseTemp();
					String starttime=TimeUtil.getDateTime(job.getStartTime());
					List<ItemValue> tempList = tempWarningServer.getOverTempList(colditem.getTids(), null,colditem.getDeviceids(),starttime,TimeUtil.getDateTime());// 获得所有超温数据
					if (SetUtil.isnotNullList(tempList) && tempList.size() > 5) {//过滤掉坏的数据
							for (ItemValue temp : tempList) {
								if(isreturn){break;}
								if(temp.getValue()<basTemp){ Lv =new int[]{ 0, 0, 0, 0, 0 };continue;}//温度恢复后
								int leve = (int) Math.floor(temp.getValue() - basTemp+0.5 )/ 2;
								if (leve > 4) {leve = 4;}
								for (int i = 0; i <=leve; i++) {//记录同级超温次数
									 Lv[i] ++;//Lv[i] =
									if (Lt[i] == null) {Lt[i] = temp.getAddtime();}
								}
								if (leve<oldelev) {//降级高于当前温度
									if(oldelev>2){
										for (int i = 4; i >oldelev; i--) {//从高到低算
											double overtime = Tv[i];//不同级别超温数据不定
											long minuteBetween = TimeUtil.minuteBetween(Lt[i],temp.getAddtime());
							                 if(minuteBetween >=overtime){
							                	 allWarningList.put(colditem.getId(), new SysWarningsInfo(colditem.getRdcId(), colditem.getId(), 1,1, TimeUtil.getDateTime(Lt[i]),TimeUtil.getDateTime(temp.getAddtime()),minuteBetween,colditem.getName()+"超温" , colditem.getName()+"发生超温1级超温告警,超基准温度（"+basTemp+"）:+"+((i+1)*2)+" ℃, 超温时长："+minuteBetween+"分钟，超温次数：1次", TimeUtil.getDateTime()));
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
										long minuteBetween = TimeUtil.minuteBetween(Lt[i],endtime)+1;
						                 if(minuteBetween >=overtime){
						                	 allWarningList.put(colditem.getId(),new SysWarningsInfo(colditem.getRdcId(), colditem.getId(), 1,i>2?1:3, TimeUtil.getDateTime(Lt[i]),TimeUtil.getDateTime(endtime),minuteBetween, colditem.getName()+"超温" , colditem.getName()+"在"+TimeUtil.getDateTime(Lt[i])+"发生"+(i>2?1:3)+"级超温告警,超基准温度（"+basTemp+"）:+"+((i+1)*2)+" ℃, 超温时长："+minuteBetween+"分钟，超温次数：1次", TimeUtil.getDateTime()));
						                	 break;
						            	 }
									}
								}
							}
							
						}
			  }
			   if(SetUtil.isNotNullMap(allWarningList)){
				   List<SysWarningsInfo> warningList=new ArrayList<SysWarningsInfo>(); 
				    for (Integer key : allWarningList.keySet()) {
					    addAlercoun(key);
					    newextsid.remove(key);
					    warningList.add(allWarningList.get(key));
					 }
					 this.sysWarningsInfoMapper.addSyswarningsinfo(warningList);
			    }
			    if(SetUtil.isnotNullList(newextsid)){
			    	for (Integer integer : newextsid) {
			    		extBlacklist.remove(integer);
					}
			    }
			   
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
	}
		
	
		
		
	}
}
