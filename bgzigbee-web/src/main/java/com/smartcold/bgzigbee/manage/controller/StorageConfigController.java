package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.smartcold.bgzigbee.manage.dao.StorageManageTypeMapper;
import com.smartcold.bgzigbee.manage.dao.StorageTemperTypeMapper;
import com.smartcold.bgzigbee.manage.dao.StorageTypeMapper;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.dto.ResultDto;
import com.smartcold.bgzigbee.manage.entity.StorageManageTypeEntity;
import com.smartcold.bgzigbee.manage.entity.StorageTemperTypeEntity;
import com.smartcold.bgzigbee.manage.entity.StorageTypeEntity;
@Controller
@RequestMapping(value = "/rdc")
public class StorageConfigController {
	@Autowired
	private StorageManageTypeMapper manageTypeDao;
	@Autowired
	private StorageTypeMapper typeDao;
	@Autowired
	private StorageTemperTypeMapper temperTypeDao;
	
	@RequestMapping(value = "/findRdcConfig", method = RequestMethod.POST)
	@ResponseBody
	public Object findRdcConfig(@RequestParam(value="audit", required=false) Integer audit) {
		if( !(audit == -1 || audit == 1 || audit == 0) ){
			audit = null;
		}
		if(audit == 0)
		   return manageTypeDao.findAll();
		else if(audit == 1)
			return typeDao.findAll();
		else
			return temperTypeDao.findAll();
	}
	
	@RequestMapping(value = "/deleteConfig", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteConfig(Integer configID, Integer audit) throws UnsupportedEncodingException {
		if( !(audit == -1 || audit == 1 || audit == 0) ){
			audit = null;
		}
		if(audit == 0)
			   manageTypeDao.deleteStorageManageType(configID);
		else if(audit == 1)
			   typeDao.deleteStorageType(configID);
		else
			   temperTypeDao.deleteStorageTemperType(configID);
		return new BaseDto(0);
	}
	
	@RequestMapping(value = "/addConfig", method = RequestMethod.GET)
	@ResponseBody
	public Object addConfig(String config, Integer audit) throws UnsupportedEncodingException {
		int id = 0;
		if (config == null || config.equals("")) {
			return new ResultDto(-1, "添加类型不能为空");
		}
		if( !(audit == -1 || audit == 1 || audit == 0) ){
			audit = null;
		}
		if(audit == 0)
		{
			  StorageManageTypeEntity managetype = new StorageManageTypeEntity();
			  managetype.setType(URLDecoder.decode(config, "UTF-8"));
			  manageTypeDao.addStorageManageType(managetype);
			  id = managetype.getId();
		}
		else if(audit == 1){
			  StorageTypeEntity storagetype = new StorageTypeEntity();
			  storagetype.setType(URLDecoder.decode(config, "UTF-8"));
			  typeDao.addStorageType(storagetype);
			  id = storagetype.getId();
			  }
		else{
			  StorageTemperTypeEntity tempertype = new StorageTemperTypeEntity();
			  tempertype.setType(URLDecoder.decode(config, "UTF-8"));
			  temperTypeDao.addStorageTemperType(tempertype);
			  id = tempertype.getId();
		}
		return id;
	}
}
