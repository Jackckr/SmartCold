package com.smartcold.manage.cold.service.task;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

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
		
	
 	public static String httpPost(String urlStr, Map<String, Object> params) {
 		URL connect;
 		StringBuffer data = new StringBuffer();
 		try {
 			connect = new URL(urlStr);
 			HttpURLConnection connection = (HttpURLConnection) connect.openConnection();
 			connection.setRequestMethod("POST");
 			connection.setDoOutput(true);
 			connection.setDoInput(true);
 			connection.setUseCaches(false);// post不能使用缓存
 			connection.setInstanceFollowRedirects(true);
 			connection.setRequestProperty("accept", "*/*");
 			connection.setRequestProperty("connection", "Keep-Alive");
 			connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
 			OutputStreamWriter paramout = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
 			String paramsStr = ""; // 拼接Post 请求的参数
 			for (String param : params.keySet()) {
 				paramsStr += "&" + param + "=" + params.get(param);
 			}
 			if (!paramsStr.isEmpty()) {
 				paramsStr = paramsStr.substring(1);
 			}
 			paramout.write(paramsStr);
 			paramout.flush();
 			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
 			String line;
 			while ((line = reader.readLine()) != null) {
 				data.append(line);
 			}
 			paramout.close();
 			reader.close();
 		} catch (Exception e) {
 			e.printStackTrace();
 		}
 		return data.toString();
 	}
 	
	
		private String initConnect(){
	 		  Map<String, Object> params  =new HashMap<String, Object>();
	 		  params.put("account", "liankur");
	 		  params.put("passwd", "liankur");
	 		  return httpPost("https://wlx.cheqianzi.net/service-api/wlx/user/02/login",params);
		}
		
		public static void main(String[] args) {
			WLXDevService service=new WLXDevService();
			String initConnect = service.initConnect();
			System.err.println(initConnect);
		}
	    
	
}