package com.smartcold.manage.cold.service.task;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.springframework.scheduling.annotation.Scheduled;

/**
 * 座头鲸采集定时任务（查询数据）
 * 
 * 
 * Copyright (C) DCIS 版权所有 功能描述: ZsDevService Create on MaQiang
 * 2016年9月27日11:55:45
 * 
 **/
//@Service
public class WLXDevService  {
		
		private String initConnect(){
			StringBuffer result = new StringBuffer();
	        BufferedReader in = null;
	        try {
	        	String line; 
	        	URL realUrl = new URL("https://wlx.cheqianzi.net/wlx/user/02/login"); // 打开和URL之间的连接
	 		    URLConnection connection = realUrl.openConnection();  // 设置通用的请求属性
	 		    connection.setRequestProperty("accept", "*/*");
	 		    connection.setRequestProperty("connection", "Keep-Alive");
	 		    connection.setRequestProperty("user-agent",  "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
	 		   connection.setRequestProperty("account", "liankur");
	 		   connection.setRequestProperty("passwd", "liankur");
	            connection.connect(); // 建立实际的连接
	            in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	            while ((line = in.readLine()) != null) {
	                result.append(line);
	            }
	        } catch (Exception e) {
	        	e.printStackTrace();
	            System.out.println("座头鲸接口请求出现异常！。。。。");
	        } finally { // 使用finally块来关闭输入流
	            try {
	                if (in != null) {
	                	in.close();
	                }
	            } catch (Exception e2) { e2.printStackTrace(); }
	        }
			return result.toString();
		}
		
		public static void main(String[] args) {
			WLXDevService service=new WLXDevService();
			String initConnect = service.initConnect();
			System.err.println(initConnect);
		}
	    
	
}