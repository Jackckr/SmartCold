package com.smartcold.manage.cold.test;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.junit.Before;
import org.junit.Test;


public class BenData {

	
	//并发线程量
	private static final int threadNum = 2000;
	//并发线程数量
	private CountDownLatch cdl = new CountDownLatch(threadNum);
	
	
	
	  private final static String HITSDB_IP = "http://139.224.208.167:8086";  //实例地址
	  private final static String database = "mydb1"; //实例端口
	  private final static int SYNC_TIMEOUT_MS = 60 * 1000;
	  private Long startTime = System.currentTimeMillis();
	  static String putUrl = "http://" + HITSDB_IP + ":" + HITSDB_PORT +"write?db=mydb1";
	  static String queryUrl = "http://" + HITSDB_IP + ":" + HITSDB_PORT +"/api/query";
	  
	
	
	@Before
	public void init(){
		
	}
	
	
	
	
	@Test
	public void crashTest(){
		try {
			for (int i = 0; i < threadNum; i++) {
				new Thread(new TempRequest()).start();
				cdl.countDown();
			}
			Long sttime=System.currentTimeMillis();
			Thread.currentThread().join();
			Thread.sleep(3000);
			long endtime= System.currentTimeMillis()-sttime;
			System.err.println("用时：" +endtime);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		System.exit(0);
		
	}
	
	
	private class TempRequest implements Runnable{
		public void run() {
			this.getTempList();
		}
		private void getTempList(){
			try {
				cdl.await();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			
		
		}
		
	}
	  public String listValue(){

	        List<String> list=new ArrayList();

	        list.add("cpu_load_short,host=server02 value=0.67\n");
	        list.add("cpu_load_short,host=server02,region=us-west value=0.55\n");
	        list.add("cpu_load_short,direction=in,host=server01,region=us-west value=2.0\n");

	        String listStr=list.toString();

	        listStr=listStr.replace("[","").replace("]","").replace(", ","");

	        return listStr;
	    }


	    public String jsonArry(){
	        JSONArray jsonArray=new JSONArray();

	        jsonArray.put("test_table,host=server02 value=0.67");
	        jsonArray.put("test_table,host=server02,region=us-west value=0.55");
	        jsonArray.put("test_table,direction=in,host=server01,region=us-west value=2.0");

	        String str=jsonArray.toString();

	        str=str.replace("[","").replace("]","").replace("\",\"","\n").replace("\"","");

	        return str;
	    }
	
}
