package com.smartcold.manage.cold.test;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.entity.newdb.ZSDevDataEntity;
import com.smartcold.manage.cold.util.TimeUtil;

public class Test {

	public static void main(String[] args) {
		
		
		
		
			  boolean	isSaveDU=false;
			String devData="[{\"devid\":\"00210005\",\"datas\":{\"time\":1494729138,\"Temp\":27.82,\"AU\":0,\"BU\":0,\"CU\":0,\"AI\":0,\"BI\":0,\"CI\":0,\"PWC\":0,\"Switch\":1,\"DU\":4.26,\"BSI\":-47.5,\"apid\":\"00200001\",\"MSI\":22}},{\"devid\":\"00210001\",\"datas\":{\"time\":1494729139,\"Temp\":27.82,\"AU\":0,\"BU\":0,\"CU\":0,\"AI\":0,\"BI\":0,\"CI\":0,\"PWC\":0,\"Switch\":1,\"DU\":4.17,\"BSI\":-56.5,\"apid\":\"00200001\",\"MSI\":22}},{\"devid\":\"00210003\",\"datas\":{\"time\":1494729142,\"Temp\":27.82,\"AU\":0,\"BU\":0,\"CU\":0,\"AI\":0,\"BI\":0,\"CI\":0,\"PWC\":0,\"Switch\":1,\"DU\":4.23,\"BSI\":-48,\"apid\":\"00200001\",\"MSI\":22}},{\"devid\":\"00210006\",\"datas\":{\"time\":1494729130,\"Temp\":27.82,\"AU\":0,\"BU\":0,\"CU\":0,\"AI\":0,\"BI\":0,\"CI\":0,\"PWC\":0,\"Switch\":1,\"DU\":4.26,\"BSI\":-45,\"apid\":\"00200001\",\"MSI\":22}},{\"devid\":\"00210002\",\"datas\":{\"time\":1494729141,\"Temp\":27.82,\"AU\":0,\"BU\":0,\"CU\":0,\"AI\":0,\"BI\":0,\"CI\":0,\"PWC\":0,\"Switch\":1,\"DU\":4.21,\"BSI\":-41.5,\"apid\":\"00200001\",\"MSI\":22}},{\"devid\":\"00210004\",\"datas\":{\"time\":1494729144,\"Temp\":27.82,\"AU\":0,\"BU\":0,\"CU\":0,\"AI\":0,\"BI\":0,\"CI\":0,\"PWC\":0,\"Switch\":1,\"DU\":4.17,\"BSI\":-50.5,\"apid\":\"00200001\",\"MSI\":22}}]";
			Calendar calendar = Calendar.getInstance();
			int hours = calendar.get(Calendar.HOUR_OF_DAY); // 时
			int minutes = calendar.get(Calendar.MINUTE);    // 分
			int seconds = calendar.get(Calendar.SECOND);    // 秒
			if(hours%6==0&minutes==0&&seconds<30){ isSaveDU=true; System.err.println(TimeUtil.getDateTime()); }
			ArrayList<StorageDataCollectionEntity> dataList = new ArrayList<StorageDataCollectionEntity>();
			ArrayList<StorageDataCollectionEntity> dusiList = new ArrayList<StorageDataCollectionEntity>();
		    List<ZSDevDataEntity> parseArray = JSONArray.parseArray(devData,ZSDevDataEntity.class);  
		    String devid=null;String apid=null;Date date=null; 	HashMap<String, Object> datas =null;
			for (ZSDevDataEntity zsDevDataEntity : parseArray) {
				datas=zsDevDataEntity.getDatas();
				devid=Integer.parseInt(zsDevDataEntity.getDevid())+"";
				Integer type = 18;//无效设备
				if(type==null||type==-1){continue;}//无效设备
				apid=((Integer)datas.get("apid"))+"";
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
				}
			}
			
		
		
		
	}
	
	
	
}
