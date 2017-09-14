package com.smartcold.manage.cold.test;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.smartcold.manage.cold.dao.newdb.TempMapper;
import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.util.TimeUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:config/spring/local/appcontext-core.xml")
public class CacheCrashTest {


	@Resource
	private TempMapper tempServer;
	//并发线程量
	private static final int threadNum = 10;
	
	private static final int oid=1;
	
	private   int avgtime=0;
	//发令枪
	private CountDownLatch cdl = new CountDownLatch(threadNum);
	
	
	private Date starttime=TimeUtil.pasDate("2017-09-13 06:00:00");
	
   private Date endtime=TimeUtil.pasDate("2017-09-13 14:00:00");
   
   private List<Long> longs=new ArrayList<Long>();
	
	@Before
	public void init(){
		
	}
	
	
	
	
	@Test
	public void crashTest(){
		for (int i = 0; i < threadNum; i++) {
			new Thread(new TempRequest()).start();
			cdl.countDown();
		}
		try {
			Thread.currentThread().join();
			Thread.sleep(3000);
			System.err.println("平均时间："+(avgtime/threadNum));
			
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
			Long sttine=System.currentTimeMillis();
			List<ItemValue> TempList = tempServer.findVTByTime( oid, "Temp",starttime,endtime );
			 sttine=System.currentTimeMillis()-sttine;
			 
				 avgtime+=sttine;
//				 System.err.println(longs);
//				 longs.add(sttine);
//			System.out.println(Thread.currentThread().getName()+"==============>"+TempList.size()+"=============="+sttine);
		}
		
	}
	
	


	




}
