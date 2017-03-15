package com.smartcold.bgzigbee.manage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.bgzigbee.manage.dao.ColdstorageLightSetMapping;
import com.smartcold.bgzigbee.manage.entity.ColdStorageLightSetEntity;



@Controller
@RequestMapping(value = "/lightSet")
public class LightSetController extends BaseController {

	@Autowired
	private ColdstorageLightSetMapping lightSetMapping ;
	
	@RequestMapping(value = "/getLightSetById")
	@ResponseBody
    public Object getLightSetById(int id){
	   return  this.lightSetMapping.findById(id);
    }
	
	@RequestMapping(value = "/getLightSetByRdcId")
	@ResponseBody
	public Object getLightSetByRdcId(int rdcId){
		return  this.lightSetMapping.findByRdcId(rdcId);
	}
	
	@RequestMapping(value = "/findByColdStorageId")
	@ResponseBody
	public Object findByColdStorageId(int coldStorageId){
		return  this.lightSetMapping.findByColdStorageId(coldStorageId);
	}
	
	
	@RequestMapping(value = "/delLightById")
	public void delLightById(int id){
			this.lightSetMapping.delete(id);
	}

	@RequestMapping(value = "/addLightSet")
	@ResponseBody
	public boolean addLightSet(ColdStorageLightSetEntity coldStorageLightSetEntity){
		return   this.lightSetMapping.insert(coldStorageLightSetEntity);
	}
	
	@RequestMapping(value = "/upLightSet")
	public void upLightSet(ColdStorageLightSetEntity coldStorageLightSetEntity){
		   this.lightSetMapping.update(coldStorageLightSetEntity);
	}
	
	
	

}
