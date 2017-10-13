package com.smartcold.manage.cold.util;

import java.util.LinkedList;




public class CacheManager {
  
	public static  LinkedList<String> zwdataList=new LinkedList<String>();
	public static void addZWTempData(String data){zwdataList.push(data);if(zwdataList.size()>100){zwdataList.clear();}}
	
//	public static  LinkedList<String> wlxataList=new LinkedList<String>();
//	public static void addwlxTempData(String data){wlxataList.push(data);if(wlxataList.size()>30){wlxataList.clear();}}
	
	
	
	
    
}