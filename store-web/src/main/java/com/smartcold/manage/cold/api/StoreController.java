package com.smartcold.manage.cold.api;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.influxdb.dto.QueryResult;
import org.influxdb.dto.QueryResult.Result;
import org.influxdb.dto.QueryResult.Series;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.smartcold.manage.cold.controller.BaseController;
import com.smartcold.manage.cold.entity.newdb.CodeInfo;
import com.smartcold.manage.cold.service.StoreDataSever;



@Controller
@RequestMapping(value="storeController")
public class StoreController extends BaseController {

	@Autowired
	public StoreDataSever storeDataSever;
	
	@RequestMapping(value = "/data")
	@ResponseBody
	public Object data() {	
		
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
	  return true;
  }
	
	
	@RequestMapping(value = "/getdata")
	@ResponseBody
	public Object getdata() {	
	        QueryResult results = this.storeDataSever.query("select * from Temp") ;  
	        return  results;
  }
	
	
}