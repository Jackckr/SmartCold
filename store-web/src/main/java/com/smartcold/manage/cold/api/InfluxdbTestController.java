package com.smartcold.manage.cold.api;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.entity.newdb.CodeInfo;
import com.smartcold.manage.cold.service.StoreDataSever;




@Controller
@RequestMapping(value="InfluxdbTestController")
public class InfluxdbTestController {


	@Autowired
	public StoreDataSever storeDataSever;
	
	private static Logger logger = LoggerFactory.getLogger(InfluxdbTestController.class);
	
	
	private static final int threadNum = 2000;
	
	
	private CountDownLatch cdl = new CountDownLatch(threadNum);
	
	
	@RequestMapping(value = "/data")
	@ResponseBody
	public Object data() {	
		for (int i = 0; i < threadNum; i++) {
			new Thread(new UserRequest()).start();
			cdl.countDown();
		}
		
		try {
			Thread.currentThread().join();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return true;
	};
	
	
	
	private class UserRequest implements Runnable{

		@Override
		public void run() {
			try {
				cdl.await();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			long starttime = System.currentTimeMillis();
			mockData();
			System.err.println(Thread.currentThread().getName()+"==============>插入完成,用时"+(System.currentTimeMillis()-starttime));
		}
		
	}
	
	
	public void mockData(){
			 Map<String, String> tags = new HashMap<String, String>();  
		        Map<String, Object> fields = new HashMap<String, Object>();  
		        List<CodeInfo> list = new ArrayList<CodeInfo>();  
		          
		        CodeInfo info1 = new CodeInfo();  
		        info1.setId(1L);  
		        info1.setName("BANKS");  
		        info1.setCode("ABC");  
		        info1.setDescr("中国农业银行");  
		        info1.setDescrE("ABC");  
		        info1.setCreatedBy("system");  
		        info1.setCreatedAt(new Date().getTime());  
		          
		        CodeInfo info2 = new CodeInfo();  
		        info2.setId(2L);  
		        info2.setName("BANKS");  
		        info2.setCode("CCB");  
		        info2.setDescr("中国建设银行");  
		        info2.setDescrE("CCB");  
		        info2.setCreatedBy("system");  
		        info2.setCreatedAt(new Date().getTime());  
		          
		        list.add(info1);  
		        list.add(info2);  
		          
		        for(CodeInfo info : list){  
		            tags.put("TAG_CODE", info.getCode());  
		            tags.put("TAG_NAME", info.getName());  
		            fields.put("ID", info.getId());  
		            fields.put("NAME", info.getName());  
		            fields.put("CODE", info.getCode());  
		            fields.put("DESCR", info.getDescr());  
		            fields.put("DESCR_E", info.getDescrE());  
		            fields.put("CREATED_BY", info.getCreatedBy());  
		            fields.put("CREATED_AT", info.getCreatedAt());  
		            storeDataSever.insert("Temp", tags, fields);  
	         }
 }

}
