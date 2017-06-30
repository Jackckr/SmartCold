package com.smartcold.manage.cold.test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import com.alibaba.fastjson.JSON;

public class Client {
	
	public static void main(String[] args) throws Exception {
		User user=new User(1,25,1,"HH");
		Socket	server = new Socket("192.168.1.136", 2196);
		BufferedReader in = new BufferedReader(new InputStreamReader( server.getInputStream()));
		PrintWriter out = new PrintWriter(server.getOutputStream());
	    String jsonString = JSON.toJSONString(user);
		out.println(jsonString);
		out.flush();
		System.out.println("返回时间："+in.readLine());
		
		BufferedReader wt = new BufferedReader(new InputStreamReader(System.in));
		while (true) {
			System.err.println("是否链接："+server.isConnected());
			String str = wt.readLine();
			out.println(str);
			out.flush();
			if (str.equals("end")) {
				break;
			}
			System.out.println(in.readLine());
		}
		server.close();

	}


	
}