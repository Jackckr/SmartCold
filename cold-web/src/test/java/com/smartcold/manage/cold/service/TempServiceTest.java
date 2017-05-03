package com.smartcold.manage.cold.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.smartcold.manage.cold.dao.newdb.DeviceObjectMappingMapper;
import com.smartcold.manage.cold.dao.olddb.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.olddb.MessageMapper;
import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.olddb.SystemInformEntity;
import com.smartcold.manage.cold.util.SetUtil;
import com.smartcold.manage.cold.util.TimeUtil;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-08-18 09:28)
 */
@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class TempServiceTest {

    @Autowired
    private RdcService rdcService;
    @Autowired
	private StorageService storageService;
    @Autowired
	private MessageMapper msMappergMapper;
	@Autowired
	private DeviceObjectMappingMapper deviceMapper;
	@Autowired
	private ColdStorageSetMapper coldStorageSetMapper;
	
    @Test
    @Rollback(true)
    public void findRdcsByUserId()  {
    	this.resetDevStatus();
    	this.LowbatteryAlarm();
    }

    
    /**
	 * 重置DEV
	 */
	private void resetDevStatus(){
        try {
			HashMap<String, Object> filter  = new HashMap<String, Object>();
			filter.put("status", 0);filter.put("type", 18);// 仅检查温度
			List<DeviceObjectMappingEntity> devciceList = this.deviceMapper.findInfoByfilter(filter);
			if(SetUtil.isnotNullList(devciceList)){
				Date endTime = new Date();Date startTime = TimeUtil.getBeforeMinute(30);
				StringBuffer devmapid=new StringBuffer();
				StringBuffer devid=new StringBuffer();
				for (DeviceObjectMappingEntity obj : devciceList) {
					Integer size = this.storageService .findCounSizeByTime(obj.getType(), obj.getOid(), obj.getDeviceid(), "Temp", startTime, endTime);//keyval.get(obj.getType())
					if(size>0){devmapid.append(obj.getId()+",");devid.append(obj.getDeviceid()+",");}
				}
				if(devmapid.length()>0){
					this.deviceMapper.resetDevByID(devmapid.substring(0, devmapid.length()-1));
					String msg= "系统在"+TimeUtil.getDateTime()+"自动重置{"+devid.subSequence(0, devid.length()-1)+"}设备！";
					this.msMappergMapper.addsystemInform(new SystemInformEntity(1,2, null, null, 0, 0, 0,"DEV自动重置",msg));//添加至系统通知
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//低电量 
	private void LowbatteryAlarm(){
        try {
			List<HashMap<String, Object>> lowPower = this.deviceMapper.getLowPower(TimeUtil.getDateTime(TimeUtil.getBeforeHOUR(12)));
			if(SetUtil.isnotNullList(lowPower)){
				String msg= "系统在"+TimeUtil.getDateTime()+"检测到设备电压过低"+ JSONArray.toJSON(lowPower);
				this.msMappergMapper.addsystemInform(new SystemInformEntity(1,2, null, null, 0, 0, 0,"DEV低电量告警",msg));//添加至系统通知
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
