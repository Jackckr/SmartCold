package com.smartcold.manage.cold.controller;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.olddb.CompanyRdcMapper;
import com.smartcold.manage.cold.dao.olddb.RdcSensorMapper;
import com.smartcold.manage.cold.dao.olddb.SensorMapper;
import com.smartcold.manage.cold.entity.olddb.RdcSensor;
import com.smartcold.manage.cold.entity.olddb.Sensor;

@Controller
@RequestMapping(value = "/rdcSensor")
public class RdcSensorController {

    @Autowired
    private RdcSensorMapper rdcSensorDao;
    
    @Autowired
    private SensorMapper sensorDao;
    
    @Autowired
    private CompanyRdcMapper compRdcDao;
    
    //get background image url of rdc
    @RequestMapping(value = "/findRdcBkgImaUrl", method = RequestMethod.GET)
    @ResponseBody
    public Object findRdcBkgImaUrl( int rdcId) {
    	return compRdcDao.selectByRdcId(rdcId).getImgurl();
    }
    
    // get list of sensor by the id of rdc
    @SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/findSensorInfoByRdcId", method = RequestMethod.GET)
    @ResponseBody
    public Object findSensorInfoByRdcId(int rdcId) {
		List<RdcSensor> rdcSensorList = new ArrayList();
        List sensorInfoList = new ArrayList();
		rdcSensorList = rdcSensorDao.selectByRdcId(rdcId);
        
        for(RdcSensor rdcSensor : rdcSensorList){
        	Sensor sensor = sensorDao.selectByPrimaryKey(rdcSensor.getSid());
        	Map map = new HashMap();
        	map.put("rdcid", rdcId);
        	map.put("sid", rdcSensor.getSid());
        	map.put("wd", sensor.getTemp());
        	map.put("shd", sensor.getHumi());
        	if(rdcSensor.getSx()!=null)
        	    map.put("div_x", rdcSensor.getSx());
        	else
        		map.put("div_x", "");
        	if(rdcSensor.getSy()!=null)
        	    map.put("div_y", rdcSensor.getSy());
        	else
        		map.put("div_y", "");
        	sensorInfoList.add(map);
        }
        return sensorInfoList;
    }
    
// update div_x and div_y by id of sensor
    @RequestMapping(value = "/updateConfigBySID", method = RequestMethod.GET)
    @ResponseBody
    public Object updateConfigBySID( int sid, int div_x, int div_y) {
    	RdcSensor rdcSensor = rdcSensorDao.selectBySID(sid);
    	rdcSensor.setSx(div_x);
    	rdcSensor.setSy(div_y);
    	return rdcSensorDao.updateByPrimaryKey(rdcSensor);
    }
    
}
