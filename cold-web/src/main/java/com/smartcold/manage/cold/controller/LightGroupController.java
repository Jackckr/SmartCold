package com.smartcold.manage.cold.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.smartcold.manage.cold.dao.newdb.LightGroupMapper;
import com.smartcold.manage.cold.entity.comm.ItemObject;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;
import com.smartcold.manage.cold.util.SetUtil;

/**
 * 灯组（冷库下的灯组：coldStorage->Light）
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/lightGroupController")
public class LightGroupController {

	@Autowired
	private StorageService storageService;
	@Autowired
    private LightGroupMapper lightGroupMapper;
	
	@RequestMapping("getLightSetBySID")
	@ResponseBody
	public Object getLightSetBySID(int coldStorageId){
	   return this.lightGroupMapper.getLightSetByColdStorageId(coldStorageId);
	}
	
	/**
	 * 获得灯组状态
	 * @param rdcId
	 * @return
	 */
	@RequestMapping("findByRdcId")
	@ResponseBody
	public Object findByRdcId(int rdcId){
		List<ItemObject> allData=new ArrayList<ItemObject>();
		List<ItemObject> lightList = this.lightGroupMapper.getLightSetByRdcId(rdcId);
		if(SetUtil.isnotNullList(lightList)){
			List<StorageKeyValue> infos=null;
			for (ItemObject obj : lightList) {
				infos = storageService.findByNums(StorageType.COLDSTORAGELIGHT.getType(), obj.getId(),"Status", 1);//
				obj.setIsRunning( infos.size() > 0 ? infos.get(0).getValue().intValue() : 0);
				allData.add(obj);
			}
		}
		return allData;
	}
	

	
	
}
