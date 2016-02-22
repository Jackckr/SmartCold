package com.smartcold.zigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.zigbee.manage.dao.ScdeviceMapper;
import com.smartcold.zigbee.manage.dao.ScinfoMapper;
import com.smartcold.zigbee.manage.entity.ScinfoEntity;

@Controller
@RequestMapping(value="/scdevice")
public class ScdeviceController {

	@Autowired
	private ScdeviceMapper scdeviceDao;
	
	@Autowired
	private ScinfoMapper scinfoDao;
	
	@RequestMapping(value = "/findByKey", method = RequestMethod.GET)
	@ResponseBody
	public Object findByKey(String key){
		ScinfoEntity scinfo = scinfoDao.findOneInfoByKey(key);
		if(scinfo != null){			
			return scdeviceDao.findInfoByGroupid(scinfo.getDeviceid());
		}else{
			return null;
		}
	}
}
