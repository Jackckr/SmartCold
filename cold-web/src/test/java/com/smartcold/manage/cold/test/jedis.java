package com.smartcold.manage.cold.test;

import com.mysql.jdbc.jdbc2.optional.SuspendableXAConnection;

import redis.clients.jedis.Jedis;

public class jedis {
public static void main(String[] args) {

	 try {
		 Jedis jedis = new Jedis("139.196.241.153",6379);
		 jedis.getClient();
		 System.err.println("sss");
	} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	
}
}
