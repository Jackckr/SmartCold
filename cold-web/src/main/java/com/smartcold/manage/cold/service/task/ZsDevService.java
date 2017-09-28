package com.smartcold.manage.cold.service.task;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
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
import com.smartcold.manage.cold.dao.olddb.CongfigMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.entity.newdb.ZSDevDataEntity;
import com.smartcold.manage.cold.entity.olddb.ConversionEntity;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 洲斯数据采集定时任务  自带线程同步
 * Copyright (C) DCIS 版权所有 功能描述: ZsDevService Create on MaQiang
 * 2016年9月27日11:55:45
 * 数据存在重复（准备处理）
 * 
 **/
//@Service
public class ZsDevService  {
	    private static boolean isRuning=true;
	    
		@Autowired
		private CongfigMapper congfigMapper;
		@Autowired
		private DevStatusMapper devStatusMapper;
	    @Autowired
	    private DeviceObjectMappingMapper devMapper;
	    @Autowired
	    private StorageDataCollectionMapper storageDataCollectionDao;
	    
	    public static int errCount=0;
	    public static HashMap<String, CoeffMode> devTypecache=new HashMap<String, CoeffMode>();
	    private final static String ZSURL="http://10.46.17.235:9007/v1/channels/datapoints";//
	    private static final ThreadFactory threadFactory = new ThreadFactoryBuilder().setNameFormat("Orders-%d").setDaemon(true).build();
		private static final ExecutorService executorService = Executors.newFixedThreadPool(100, threadFactory);//最多启动100个线程
		
		/**
		 * 工具类
		 * @return
		 */
		public static  String saveTime=null;
		public static boolean isRuning() {return isRuning&&errCount<3;}
		public static void clerCache() {ZsDevService.devTypecache.clear(); }
		public static void setRuning(boolean isRuning) {ZsDevService.isRuning = isRuning;if(isRuning){ZsDevService.errCount=0;}}
		public static  LinkedList<String> dataList=new LinkedList<String>();
		public static HashMap<String, StorageDataCollectionEntity> msimap=new HashMap<String, StorageDataCollectionEntity>();
		public static HashMap<String, StorageDataCollectionEntity> bsimap=new HashMap<String, StorageDataCollectionEntity>();
		public static HashMap<String, StorageDataCollectionEntity> dumap=new HashMap<String, StorageDataCollectionEntity>();
		/**
		 * 数据抓取30秒
		 */
	    @Scheduled(cron="0/30 * * * * ?")
		public void checkData() {
	    	if(errCount<3&&isRuning){
	    		this.readData();
	    	}
		}
	    /*
	     * 6小时保存一次状态（延迟15秒）
	     */
	    @Scheduled(cron = "15 0 */6 * * ?")
	    public  void timer() {
	    	ZsDevService.errCount=0;
	    	saveTime=TimeUtil.getDateTime();
	    	if(SetUtil.isNotNullMap(msimap)){
	    		ArrayList<StorageDataCollectionEntity> apstatusList = new ArrayList<StorageDataCollectionEntity>();
                   for (String key : msimap.keySet()) {   apstatusList.add(msimap.get(key)); }msimap.clear();
                   this.devStatusMapper.addAPStatusList(apstatusList);
	    	}
	    	if(SetUtil.isNotNullMap(bsimap)){
	    		 ArrayList<StorageDataCollectionEntity> devstatusList = new ArrayList<StorageDataCollectionEntity>();
	    		 for (String key : bsimap.keySet()) {   devstatusList.add(bsimap.get(key)); }bsimap.clear();
	    		 for (String key : dumap.keySet())  {   devstatusList.add(dumap.get(key)); }dumap.clear();
	    		 this.devStatusMapper.addDevStatusList(devstatusList);
	    	}
	    	
	    }
		
		private synchronized void addTempData(String data){
			dataList.push(data);if(dataList.size()>30){dataList.clear();}
		}
		
	    /**
	     * 数据读取
	     */
        private void readData(){
			boolean isrun=true;
			while (isrun) {
				String devdata = getDEVData();
				if(!"null".equals(devdata)&&devdata.length()>10){
					addTempData(devdata);
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
			 SubTask subTask=new SubTask(data,this.congfigMapper, this.storageDataCollectionDao,this.devStatusMapper,this.devMapper);
			 ZsDevService.executorService.submit(subTask);
		}
		
		
	    /**
	     * 读取数据
	     */
	    public static String getDEVData() {
	        StringBuffer result =new StringBuffer();
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
	                result.append(line);
	            }
	        } catch (Exception e) {
	        	errCount++;
	            System.out.println("洲斯数据接口请求出现异常！。。。。");
	        } finally { // 使用finally块来关闭输入流
	            try {
	                if (in != null) {
	                	in.close();
	                }
	            } catch (Exception e2) { e2.printStackTrace(); }
	        }
	        return result.toString();
	    }
	    
	    
}
class CoeffMode{
	private int type;
	private Double coefficient;
	
	public CoeffMode(int type, Double coefficient) {
		super();
		this.type = type;
		this.coefficient = coefficient;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public Double getCoefficient() {
		return coefficient;
	}
	public void setCoefficient(Double coefficient) {
		this.coefficient = coefficient;
	}
}



class SubTask implements Runnable {
  private String  devData;
  private CongfigMapper congfigMapper;
  private DevStatusMapper devStatusMapper;
  private DeviceObjectMappingMapper devMapper;
  private StorageDataCollectionMapper storageDataCollectionDao;
  
  public SubTask(String devData,CongfigMapper congfigMapper,StorageDataCollectionMapper storageDataCollectionDao,DevStatusMapper devStatusMapper,DeviceObjectMappingMapper devMapper) { 
	  this.devData= devData;
	  this.devMapper=devMapper;
	  this.congfigMapper=congfigMapper;
	  this.devStatusMapper=devStatusMapper;
      this.storageDataCollectionDao=storageDataCollectionDao;
  }
  
  
  private Double getCoefficient(String devID){
	  List<ConversionEntity> conversList = this.congfigMapper.getOHMappingByRdcId(1,devID);
	  if(SetUtil.isnotNullList(conversList)){
		return  Double.parseDouble(conversList.get(0).getMapping());
	  }
	  return 1.00;
  }
  
  public  CoeffMode getDevType(String devID){
	  if(ZsDevService.devTypecache.containsKey(devID)){
		  return ZsDevService.devTypecache.get(devID);
	  }else{
		  DeviceObjectMappingEntity devObj = this.devMapper.findInfoByDeviceId(devID);
		  	if(devObj!=null){
		  		double coefficient=1;
		  		int type = devObj.getType();
		  		if(type==10){coefficient =this.getCoefficient(devID);}
		  		CoeffMode coeffMode = new CoeffMode(type, coefficient);
		  		ZsDevService.devTypecache.put(devID,coeffMode);
		  		return coeffMode;
		  	}else{
		  		CoeffMode coeffMode = new CoeffMode(-1, 1.00);
		  		ZsDevService.devTypecache.put(devID,coeffMode);
		  		return coeffMode;
		  	}
	  }
  }
  
  @Override
  public void run() {
	    if(this.storageDataCollectionDao==null||this.devStatusMapper==null){System.err.println("数据无法保存！");return;}
	    try {
			HashMap<String, Object> datas =null;
			ArrayList<StorageDataCollectionEntity> dataList = new ArrayList<StorageDataCollectionEntity>();
		    List<ZSDevDataEntity> parseArray = JSONArray.parseArray(this.devData,ZSDevDataEntity.class);  
		    String devid=null;String apid=null;Date date=null; 
			for (ZSDevDataEntity zsDevDataEntity : parseArray) {
				datas=zsDevDataEntity.getDatas();
				devid=zsDevDataEntity.getDevid();
				CoeffMode coeffMode = this.getDevType(devid);
				if(coeffMode==null||coeffMode.getType()==-1){continue;}//无效设备
				apid=(String) datas.get("apid");
				date =new Date((Integer)datas.get("time")*1000L);
				switch (coeffMode.getType()) {
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
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"AI",  Double.parseDouble(datas.get("AI")+"")*coeffMode.getCoefficient(),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"BI",  Double.parseDouble(datas.get("BI") +"")*coeffMode.getCoefficient(),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"CI",  Double.parseDouble(datas.get("CI") +"")*coeffMode.getCoefficient(),date));
					 dataList.add(new StorageDataCollectionEntity(apid, devid,"PWC", Double.parseDouble(datas.get("PWC")+"")*coeffMode.getCoefficient(), date));
					break;
				default:
					break;
				}
				ZsDevService.dumap.put(devid, new StorageDataCollectionEntity(apid, devid,"DU", datas.get("DU") , date));
				ZsDevService.bsimap.put(devid, new StorageDataCollectionEntity(apid, devid,"BSI",datas.get("BSI"), date));
			}
			ZsDevService.msimap.put(apid, new StorageDataCollectionEntity(apid, null,"MSI",datas.get("MSI"), date));
			if(SetUtil.isnotNullList(dataList)){//保存数据
				this.storageDataCollectionDao.batchInsert(dataList);
			}
		} catch (Exception e) {
			System.err.println("洲斯接解析口出现异常:"+this.devData);
		}
  }
  


}
