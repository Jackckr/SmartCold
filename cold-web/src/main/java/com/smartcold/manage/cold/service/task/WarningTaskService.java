package com.smartcold.manage.cold.service.task;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.util.TimeUtil;

/**
 * 告警服务
 * Copyright (C) DCIS 版权所有 功能描述: TempWarningService Create on MaQiang
 * 2016年9月27日11:55:45
 **/
@Service
public class WarningTaskService  {
	
	
	
	
	 @Scheduled(cron="5 0/1 *  * * ? ")   //每5秒执行一次
    public void checkData1() {
    	System.err.println("1------------"+TimeUtil.getDateTime( ));
    }
    /**
	 * 	半个小时检查超温
	 *  L1:+2 每进入一个异常数据加入检测范围
	 *  L2:+4  
	 *  L3:+6 
	 *  L4:+8 ->极限温度
	 * 
	 * 
	 */
	@Scheduled(cron = "0 0/1 * * * ?")
    public void checkData() {
    	System.err.println("2=========="+TimeUtil.getDateTime( ));
    }
    

    
  
  
	
}
