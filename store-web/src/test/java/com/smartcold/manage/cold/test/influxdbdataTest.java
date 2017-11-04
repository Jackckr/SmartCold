package com.smartcold.manage.cold.test;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

public class influxdbdataTest {
	
	 public void createDatabase(){
//	        String url="http://139.224.208.167:8086/query?q=CREATE+DATABASE+%22db_name%22&db=_internal";
//	        String url="http://139.224.208.167:8086/query";
	        String url="http://139.224.208.167:8086/query?db=_internal&u=rootmq&p=WS!@!#ED)PL121?q=CREATE DATABASE mydb2";
//	        MultiValueMap<String,String> postParameter=new LinkedMultiValueMap<>();
//	        postParameter.add("q","CREATE DATABASE mydb2");
	        RestTemplate restTemplate=new RestTemplate();
	        restTemplate.postForObject(url,null,Object.class);
	    }
	
	public static void main(String[] args) {
		        new influxdbdataTest().createDatabase();
		
	}
	
	
}
