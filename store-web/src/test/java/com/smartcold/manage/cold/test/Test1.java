package com.smartcold.manage.cold.test;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

public class Test1 {

	
//	http://localhost:8086/write?db=mydb&u=admin&p=admin" --data-binary "cpu_load_short,host=server01,region=us-west value=0.64,value2=0.86 1434055562000000000
	
	
	public static void main(String[] args) {
		     new Test1().test1();

	}
	public void test1(){
//		     String url="http://139.224.208.167:8086/query?u=rootmq&p=WS!@!#ED)PL121";
//		     String url="http://localhost:8086/query?-u admin:admin";
		     String url="http://139.224.208.167:8086/query?-u admin:admin";
	        MultiValueMap<String,String> postParameter=new LinkedMultiValueMap<>();

//	        postParameter.add("u","rootmq");
//	        postParameter.add("p","WS!@!#ED)PL121");
//	        postParameter.add("db","test");
	        postParameter.add("q","CREATE DATABASE mydb1");

	        RestTemplate restTemplate=new RestTemplate();

	        restTemplate.postForObject(url,postParameter,Object.class);
		
		
	}
	
	public void writeMultiplePoints(){

        String url="http://localhost:8086/write?db=mydb1";

        String pointValue="cpu_load_short,host=server02  num=0.67\ncpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257\ncpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257";

        RestTemplate restTemplate=new RestTemplate();

        restTemplate.postForObject(url,pointValue,Object.class);
    }
}
