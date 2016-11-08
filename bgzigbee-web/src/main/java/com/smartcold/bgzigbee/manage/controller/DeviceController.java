package com.smartcold.bgzigbee.manage.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.smartcold.bgzigbee.manage.dto.BaseDto;
import com.smartcold.bgzigbee.manage.sc360.dao.DeviceObjectMappingMapper;
import com.smartcold.bgzigbee.manage.sc360.entity.DeviceObjectMappingEntity;



@Controller
@RequestMapping(value = "/device")
public class DeviceController extends BaseController {

	@Autowired
	private DeviceObjectMappingMapper deviceObjectMappingMapper;
	@RequestMapping(value = "/findDeviceObjectMappingList", method = RequestMethod.POST)
	@ResponseBody
	public Object findDeviceObjectMappingList(@RequestParam(value="pageNum",required=false) Integer pageNum,
			@RequestParam(value="pageSize") Integer pageSize, 
			@RequestParam(value="audit", required=false) Integer audit,
			@RequestParam(value="keyword", required=false) String keyword) throws UnsupportedEncodingException {
		if( !(audit == 1 || audit == 0) ){
			audit = null;
		}
		pageNum = pageNum == null? 1:pageNum;
		pageSize = pageSize==null? 12:pageSize;
		PageHelper.startPage(pageNum, pageSize);
		if(keyword.equals("undefined"))
			keyword = null;
		else{
		keyword = URLDecoder.decode(keyword, "UTF-8");
		}
		return new PageInfo<DeviceObjectMappingEntity>(deviceObjectMappingMapper.findAllDevice(keyword, audit));
		
	}
	
	@RequestMapping(value = "/deleteByDeviceObjectMappingID", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteByDeviceObjectMappingID(int deviceObjectMappingID) {
		 deviceObjectMappingMapper.delById(deviceObjectMappingID);
		 return new BaseDto(0);
	}
	
	@RequestMapping(value = "/deleteByDeviceObjectMappingIDs", method=RequestMethod.DELETE)
	@ResponseBody
	public Object deleteByDeviceObjectMappingIDs(Integer[] deviceObjectMappingIDs) {
		for(Integer deviceObjectMappingID : deviceObjectMappingIDs){
			 deviceObjectMappingMapper.delById(deviceObjectMappingID);
		}
		return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value="/changeAudit", method=RequestMethod.POST)
	public Object changeAudit(int deviceObjectMappingID, int audit){
		deviceObjectMappingMapper.upDeviceObjectStatus(audit, deviceObjectMappingID);
		return new BaseDto(0);
	}
	
	@ResponseBody
	@RequestMapping(value="/changeAudits", method=RequestMethod.POST)
	public Object changeAudits(int[] deviceObjectMappingIDs, int audit){
		for(int deviceObjectMappingID : deviceObjectMappingIDs)
			deviceObjectMappingMapper.upDeviceObjectStatus(audit, deviceObjectMappingID);
		return new BaseDto(0);
	}
	
}
