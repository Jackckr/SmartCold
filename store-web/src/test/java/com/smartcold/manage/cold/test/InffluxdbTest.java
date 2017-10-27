package com.smartcold.manage.cold.test;

import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringJUnit4ClassRunner.class)
public class InffluxdbTest {


	 public static void main(String[] args){
//	        new InffluxdbTest().createDatabase();
	        new InffluxdbTest().writeMultiplePoints();
	    }

	    public void createDatabase(){
	    	//http://139.224.208.167:8083/
	        String url="http://139.224.208.167:8086/query";

	        MultiValueMap<String,String> postParameter=new LinkedMultiValueMap<String,String>();

	        postParameter.add("q","CREATE DATABASE mydb1");

	        RestTemplate restTemplate=new RestTemplate();

	        Object postForObject = restTemplate.postForObject(url,postParameter,Object.class);

	    }
	    
	    
	    public void write(){
	        String url="http://139.224.208.167:8086/write?db=mydb1";

	        String pointValue="cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000";

	        RestTemplate restTemplate=new RestTemplate();

	        restTemplate.postForObject(url,pointValue,Object.class);
	    }
	    
	    public void writeMultiplePoints(){

	    	 String url="http://139.224.208.167:8086/write?db=mydb1";

	        String pointValue="cpu_load_short,host=server02  num=0.67\ncpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257\ncpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257";

	        RestTemplate restTemplate=new RestTemplate();

	        restTemplate.postForObject(url,pointValue,Object.class);
	        
	    }
	    
	    
	    
	    
	




}
