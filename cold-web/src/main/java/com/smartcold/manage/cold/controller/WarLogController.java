package com.smartcold.manage.cold.controller;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.util.SetUtil;

/**
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/warlog")
public class WarLogController extends BaseController {
	private static final ThreadFactory threadFactory = new ThreadFactoryBuilder().setNameFormat("Orders-%d").setDaemon(true).build();
	private static final ExecutorService executorService = Executors.newFixedThreadPool(10, threadFactory);
	
	/**
	 * 添加线程队列
	 * @param arrayList
	 */
	public static void addextTask(List<StorageDataCollectionEntity> arrayList){
		 SubTask subTask=new SubTask(arrayList);
		 executorService.submit(subTask);
	}
}

class SubTask implements Runnable {
	List<StorageDataCollectionEntity> arrayList;
    public SubTask(List<StorageDataCollectionEntity> data) { this.arrayList = data;  }
	@Override
    public void run() {
      if(SetUtil.isNullList(arrayList))return;
      try {
	       for (StorageDataCollectionEntity sdet : arrayList) {
				System.err.println(sdet.getKey());
	       }
		} catch (Exception e) {
			e.printStackTrace();
		}
    }
}

