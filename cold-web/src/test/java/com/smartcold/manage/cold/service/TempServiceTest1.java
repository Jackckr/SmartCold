//
//package com.smartcold.manage.cold.service;
//
//import java.util.HashMap;
//import java.util.List;
//
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.smartcold.manage.cold.dao.olddb.RdcMapper;
//import com.smartcold.manage.cold.util.RemoteUtil;
//import com.smartcold.manage.cold.util.SetUtil;
//import com.smartcold.manage.cold.util.StringUtil;
//
//
///**
// * Author:maqiang34
// * Date: maqiang34
// */
//
//public class TempServiceTest1 {
//
//
//	@Test
//    public void pushTest(){
//		HashMap<String, Object> stringObjectHashMap = new HashMap<>();
//		stringObjectHashMap.put("token",StringUtil.getToken());//超温时长
//		stringObjectHashMap.put("userIds","1");//发送对象---？
//		stringObjectHashMap.put("rdcid",1063);//rdc -跳转
//		stringObjectHashMap.put("rdcName","合肥老母鸡");//--rdc名称 ？？
//		stringObjectHashMap.put("coldStorageName","冷库1");
//		stringObjectHashMap.put("basTemp",-18);
//		stringObjectHashMap.put("diffTemp",4);
//		stringObjectHashMap.put("overTemp",5);//
//		stringObjectHashMap.put("starttime","2017-9-23 10:54:13");//开始时间
//		stringObjectHashMap.put("ovtTempTime",30);//超温时长
//		try {
//			RemoteUtil.httpPost("http://139.196.167.165/i/warning/waringNotice",stringObjectHashMap);
////			RemoteUtil.httpPost("http://192.168.1.116:8081/i/warning/waringNotice",stringObjectHashMap);
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//    }
//
//
//
//
//}
