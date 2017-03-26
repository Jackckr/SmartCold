package com.smartcold.manage.cold.service.impl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.smartcold.manage.cold.dao.newdb.DevStatusMapper;
import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.StorageDataCollectionMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.entity.newdb.ZSDevDataEntity;
import com.smartcold.manage.cold.service.ZsDevService;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 洲斯数据采集
 * Copyright (C) DCIS 版权所有 功能描述: ZsDevServiceimp Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class ZsDevServiceimp implements ZsDevService {
	
		@Autowired
		private DevStatusMapper devStatusMapper;
	    @Autowired
	    private DeviceObjectMappingMapper devMapper;
	    @Autowired
	    private StorageDataCollectionMapper storageDataCollectionDao;
	    private static int errCount=0;
	    public static String data=null;
//	    private final static String ZSURL="http://139.196.240.174:9007/v1/channels/datapoints";
	    private final static String ZSURL="http://10.46.17.235:9007/v1/channels/datapoints";//
	    private static final ThreadFactory threadFactory = new ThreadFactoryBuilder().setNameFormat("Orders-%d").setDaemon(true).build();
		private static final ExecutorService executorService = Executors.newFixedThreadPool(100, threadFactory);//最多启动一千1000个线程
		public static HashMap<String, Integer> devTypecache=new HashMap<String, Integer>();
		
		
		/**
		 * 数据抓取
		 */
	    @Scheduled(cron="0/30 * * * * ?")
		public void checkData() {
	    	if(errCount<3){
	    		this.saveData();
	    	}
		}
	    
	    
		@Scheduled(cron = "0 0/30 * * * ?")
		public void checkStatus() {
			errCount=0;
		}
	    /**
	     * 数据读取
	     */
        private void saveData(){
			boolean isrun=true;
			while (isrun) {
				String devdata = getDEVData();
				if(!"null".equals(devdata)&&devdata.length()>10){
					data=devdata;
					this.addextTask(devdata);
				}else{
					isrun=false;
				}
			}
		}
		
		
		/**
		 * 添加线程队列
		 * @param arrayList
		 */
		public  void addextTask(String data ){
			 SubTask subTask=new SubTask(data, this.storageDataCollectionDao,this.devStatusMapper,this.devMapper);
			 ZsDevServiceimp.executorService.submit(subTask);
		}
		
	    public static String getDEVData() {
	        String result = "";
	        BufferedReader in = null;
	        try {
	        	String line; 
	        	URL realUrl = new URL(ZSURL); // 打开和URL之间的连接
	 		    URLConnection connection = realUrl.openConnection();  // 设置通用的请求属性
	 		    connection.setRequestProperty("accept", "*/*");
	 		    connection.setRequestProperty("connection", "Keep-Alive");
	 		    connection.setRequestProperty("apikey", "2006c71f23ed1bfdab3a4b7d4986af13");
	 		    connection.setRequestProperty("user-agent",  "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
	            connection.connect(); // 建立实际的连接
	            in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	            while ((line = in.readLine()) != null) {
	                result += line;
	            }
	        } catch (Exception e) {
	        	errCount++;
	            System.out.println("洲斯接口请求出现异常！。。。。");
	        } finally { // 使用finally块来关闭输入流
	            try {
	                if (in != null) {
	                	in.close();
	                }
	            } catch (Exception e2) { e2.printStackTrace(); }
	        }
	        return result;
	    }
	   
}

class SubTask implements Runnable {
  private String  devData;
  private DevStatusMapper devStatusMapper;
  private DeviceObjectMappingMapper devMapper;
  private StorageDataCollectionMapper storageDataCollectionDao;
  
  public SubTask(String devData,StorageDataCollectionMapper storageDataCollectionDao,DevStatusMapper devStatusMapper,DeviceObjectMappingMapper devMapper) { 
	  this.devData= devData;
	  this.devMapper=devMapper;
	  this.devStatusMapper=devStatusMapper;
      this.storageDataCollectionDao=storageDataCollectionDao;
  }
  
  
  public  Integer getDevType(String devID){
	  if(ZsDevServiceimp.devTypecache.containsKey(devID)){
		  return ZsDevServiceimp.devTypecache.get(devID);
	  }else{
		  DeviceObjectMappingEntity devObj = this.devMapper.findInfoByDeviceId(devID);
		  	if(devObj!=null){
		  		int type = devObj.getType();
		  		ZsDevServiceimp.devTypecache.put(devID, type);
		  		return type;
		  	}
		  	return null;
	  }
  }
  
  @Override
  public void run() {
	    if(this.storageDataCollectionDao==null||this.devStatusMapper==null){System.err.println("数据无法保存！");return;}
	    try {
			Long sttime=new Date().getTime();
			boolean isSaveDU=true;
			HashMap<String, Object> datas =null;
			Calendar calendar = Calendar.getInstance();
			int hours = calendar.get(Calendar.HOUR_OF_DAY); // 时
			int minutes = calendar.get(Calendar.MINUTE);    // 分
			int seconds = calendar.get(Calendar.SECOND);    // 秒
			if(hours%6==0&minutes==0&&seconds<30){ isSaveDU=true; System.err.println(TimeUtil.getDateTime()); }
			ArrayList<StorageDataCollectionEntity> dataList = new ArrayList<StorageDataCollectionEntity>();
			ArrayList<StorageDataCollectionEntity> dusiList = new ArrayList<StorageDataCollectionEntity>();
		    List<ZSDevDataEntity> parseArray = JSONArray.parseArray(this.devData,ZSDevDataEntity.class);  
		    String devid=null;String apid=null;Date date=null; 
			for (ZSDevDataEntity zsDevDataEntity : parseArray) {
				datas=zsDevDataEntity.getDatas();
				devid=zsDevDataEntity.getDevid();
				Integer type = this.getDevType(devid);//无效设备
				if(type==null||type==-1){continue;}//无效设备
				apid=(String) datas.get("apid");
				date =new Date( (Integer)datas.get("time")*1000L);
				switch (type) {
				case 18://温度
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"Temp",  datas.get("Temp"), date));
					break;
				case 2://冷库门
					dataList.add(new StorageDataCollectionEntity(apid, devid,"Switch",  datas.get("Switch"), date));
					break;
				case 10://电量
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"AU",  datas.get("AU"),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"BU",  datas.get("BU"),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"CU",  datas.get("CU"),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"AI",  datas.get("AI"),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"BI",  datas.get("BI"),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"CI",  datas.get("CI"),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"PWC", datas.get("PWC"), date));
					break;
				default:
					break;
				}
				if(isSaveDU){//保存设备电压
					dusiList.add(new StorageDataCollectionEntity(apid, devid,"DU", datas.get("DU") , date));
					dusiList.add(new StorageDataCollectionEntity(apid, devid,"BSI",datas.get("BSI"), date));
					dusiList.add(new StorageDataCollectionEntity(apid, devid,"MSI",datas.get("MSI"), date));
				}
			}
			if(SetUtil.isnotNullList(dataList)){
				this.storageDataCollectionDao.batchInsert(dataList);
			}
			if(isSaveDU&&SetUtil.isnotNullList(dusiList)){
				this.devStatusMapper.addDataList(dusiList);
			}
			Long end=new Date().getTime()-sttime;
			System.err.println("用时："+end);
	    	
			} catch (Exception e) {
				e.printStackTrace();
			}
  }
}
