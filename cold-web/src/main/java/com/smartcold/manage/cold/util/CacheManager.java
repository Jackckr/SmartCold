package com.smartcold.manage.cold.util;

import java.util.LinkedList;




public class CacheManager {
  
	public static  LinkedList<String> zwdataList=new LinkedList<String>();
	public static void addZWTempData(String data){zwdataList.push(data);if(zwdataList.size()>30){zwdataList.clear();}}
	
	
	
	
    
}