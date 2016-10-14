package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.newdb.WarningLogMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
import com.smartcold.manage.cold.entity.newdb.WarningsLog;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;
import com.smartcold.manage.cold.util.SetUtil;

/**
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/warlog")
public class WarLogController extends BaseController {
	@Autowired
	private WarningLogMapper warningLogMapper;

	@RequestMapping(value = "/findWarningLogsByRdcID", method = RequestMethod.GET)
	@ResponseBody
	public Object findWarningLogsByRdcID(@RequestParam int rdcId) {
		return warningLogMapper.findAllWarningLog(rdcId);
	}
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
	@Autowired
	private DeviceObjectMappingMapper deviceObjectMappingMapper;
	@Autowired
	private ColdStorageSetMapper coldStorageSetMapper;
	@Autowired
	private WarningLogMapper warningLogMapper;
	List<StorageDataCollectionEntity> arrayList;
    public SubTask(List<StorageDataCollectionEntity> data) { this.arrayList = data;  }
	@Override
    public void run() {
      if(SetUtil.isNullList(arrayList))return;
      try {
    	  List<WarningsLog> errInfoList=new ArrayList<WarningsLog>();
	       for (StorageDataCollectionEntity sdet : arrayList) {
	    	   if (sdet.getKey().equals("Temp")) {
	    		  List<DeviceObjectMappingEntity> deviceObjectMappingList =  deviceObjectMappingMapper.findByTypeDeviceId(1, sdet.getDeviceid());
	    		  for (DeviceObjectMappingEntity deviceObjectMappingEntity : deviceObjectMappingList) {
	    			  ColdStorageSetEntity coldStorageSetEntity =  coldStorageSetMapper.findById(deviceObjectMappingEntity.getOid());
	    			  if (Double.parseDouble(sdet.getValue())>(coldStorageSetEntity.getStartTemperature()+coldStorageSetEntity.getOvertempalarm())) {
	    				  WarningsLog warningsLog = new WarningsLog();
	    				  warningsLog.setRdcid(coldStorageSetEntity.getRdcId());
	    				  warningsLog.setMsg(coldStorageSetEntity.getName()+sdet.getKey()+"温度异常");
	    				  errInfoList.add(warningsLog);
					}
				}
			  }
	      }
	       warningLogMapper.addWarningLog(errInfoList);
		} catch (Exception e) {
			e.printStackTrace();
		}
    }
}

